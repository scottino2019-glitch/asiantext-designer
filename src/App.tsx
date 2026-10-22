import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './components/Toolbar/Toolbar';
import { EditorCanvas } from './components/Editor/EditorCanvas';
import { RubyModal } from './components/Modals/RubyModal';
import { ImageModal } from './components/Modals/ImageModal';
import { TableModal } from './components/Modals/TableModal';
import { DocumentPageSettings } from './types/editor';
import { DOCUMENT_TEMPLATES } from './utils/documentTemplates';
import { CJK_LIST_TYPES } from './utils/cjkLists';
import { exportToPdf, triggerPrintDialog } from './utils/pdfExport';
import { convertChineseToRubyBatch, convertHanjaToRubyBatch } from './utils/pinyinEngine';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'cjk_doccraft_content_v9';
const STORAGE_SETTINGS_KEY = 'cjk_doccraft_settings_v9';

// Sanitize HTML to prevent vertical writing mode or nested contenteditable
function sanitizeContent(html: string): string {
  if (!html) return html;
  return html
    .replace(/writing-mode:\s*vertical-rl;?/gi, '')
    .replace(/writing-vertical-rl/gi, '')
    .replace(/contenteditable="true"/gi, '')
    .replace(/<div contenteditable="true"[^>]*>/gi, '<div>');
}

export default function App() {
  const [contentHtml, setContentHtml] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return sanitizeContent(saved);
    return DOCUMENT_TEMPLATES[0].html;
  });

  const [pageSettings, setPageSettings] = useState<DocumentPageSettings>(() => {
    const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force horizontal-tb to eliminate any space/enter inversion
        return { ...parsed, writingMode: 'horizontal-tb' };
      } catch (e) {
        // Fallback
      }
    }
    return {
      format: 'a4',
      orientation: 'portrait',
      margin: 'normal',
      zoom: 100,
      writingMode: 'horizontal-tb',
      title: 'Documento Cinese & Coreano',
      showPageNumbers: true,
      headerText: 'CJK DocCraft PDF Editor',
    };
  });

  const [isRubyModalOpen, setIsRubyModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);
  const savedSelectionRange = useRef<Range | null>(null);

  // Auto-save content safely
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, contentHtml);
    } catch (e) {
      console.warn('Storage quota exceeded, skipping local cache update:', e);
    }
  }, [contentHtml]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(pageSettings));
    } catch (e) {
      // Ignore
    }
  }, [pageSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save selection before modal opens (only if inside editor)
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRange.current = range.cloneRange();
        setSelectedText(sel.toString().trim());
        return;
      }
    }
    savedSelectionRange.current = null;
    setSelectedText('');
  };

  const restoreSelection = () => {
    if (savedSelectionRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange.current);
      }
    }
  };

  // Insert HTML strictly inside the page sheet canvas
  const insertHtmlAtCursor = (html: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    let targetRange: Range | null = null;

    if (
      savedSelectionRange.current &&
      editorRef.current.contains(savedSelectionRange.current.commonAncestorContainer)
    ) {
      targetRange = savedSelectionRange.current;
    } else {
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)
      ) {
        targetRange = sel.getRangeAt(0);
      }
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: Node | null;
    let lastNode: Node | null = null;
    while ((node = tempDiv.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    if (targetRange) {
      // Step outside <ruby>, <rt>, <rp> tags so we do not break Ruby typography
      let container: Node | null = targetRange.startContainer;
      while (container && container !== editorRef.current) {
        if (
          container instanceof HTMLElement &&
          (container.tagName === 'RUBY' || container.tagName === 'RT' || container.tagName === 'RP')
        ) {
          targetRange.setStartAfter(container);
          targetRange.collapse(true);
          break;
        }
        container = container.parentNode;
      }

      targetRange.deleteContents();
      targetRange.insertNode(frag);

      // Move caret after inserted content
      if (lastNode) {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
    } else {
      // No active selection inside sheet: insert directly inside the sheet!
      if (html.includes('doc-image-watermark')) {
        editorRef.current.insertBefore(frag, editorRef.current.firstChild);
      } else {
        editorRef.current.appendChild(frag);
      }
    }

    savedSelectionRange.current = null;
    setContentHtml(editorRef.current.innerHTML);
  };

  // 1-Click Automatic Ruby conversion on currently highlighted text
  const handleConvertSelectionRuby = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const text = sel.toString().trim();
      if (!text) return;

      // Detect if Korean or Chinese (or default to Chinese Pinyin)
      const isKorean = /[\uac00-\ud7af]/.test(text);
      const rubyHtml = isKorean
        ? convertHanjaToRubyBatch(text)
        : convertChineseToRubyBatch(text);

      const range = sel.getRangeAt(0);
      range.deleteContents();

      const el = document.createElement('span');
      el.innerHTML = rubyHtml;
      range.insertNode(el);

      setContentHtml(editorRef.current.innerHTML);
      showToast(`✨ Pinyin automatico generato per: "${text.slice(0, 15)}${text.length > 15 ? '...' : ''}"`);
    } else {
      // Nothing selected: open the batch Ruby modal so user can paste whole text!
      saveCurrentSelection();
      setIsRubyModalOpen(true);
    }
  };

  // Formatting commands
  const handleFormat = (command: string, value: string = '') => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    setContentHtml(editorRef.current.innerHTML);
  };

  // Apply custom font family to selection or paragraph
  const handleApplyFont = (fontFamily: string, fontName?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontFamily = fontFamily;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Re-select the span so the text stays highlighted!
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);

      setContentHtml(editorRef.current.innerHTML);
    } else {
      document.execCommand('fontName', false, fontFamily);
      setContentHtml(editorRef.current.innerHTML);
    }
    showToast(`Font applicato: ${fontName || fontFamily.split(',')[0].replace(/['"]/g, '')}`);
  };

  // Apply font size in px
  const handleApplyFontSize = (sizePx: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizePx;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Re-select the span so the text stays highlighted!
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);

      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Apply text color
  const handleApplyColor = (color: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Re-select the span so the text stays highlighted!
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);

      setContentHtml(editorRef.current.innerHTML);
    } else {
      document.execCommand('foreColor', false, color);
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Apply background highlight color
  const handleApplyBgColor = (color: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      span.appendChild(range.extractContents());
      range.insertNode(span);

      // Re-select the span so the text stays highlighted!
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);

      setContentHtml(editorRef.current.innerHTML);
    } else {
      document.execCommand('hiliteColor', false, color);
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Apply line height to active block
  const handleApplyLineHeight = (height: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node instanceof HTMLElement && (node.tagName === 'P' || node.tagName === 'DIV' || node.tagName === 'LI')) {
          node.style.lineHeight = height;
          setContentHtml(editorRef.current.innerHTML);
          return;
        }
        node = node.parentNode;
      }
    }
    editorRef.current.style.lineHeight = height;
    setContentHtml(editorRef.current.innerHTML);
  };

  // Apply letter spacing
  const handleApplyLetterSpacing = (spacing: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.letterSpacing = spacing;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      setContentHtml(editorRef.current.innerHTML);
    }
  };

  // Insert specialized CJK list
  const handleInsertCjkList = (listTypeId: string) => {
    const listDef = CJK_LIST_TYPES.find((l) => l.id === listTypeId);
    if (!listDef) return;

    const items = listDef.items.slice(0, 3);
    const listHtml = `
      <div style="margin: 0.75rem 0; padding-left: 0.5rem;" class="cjk-list-block">
        ${items
          .map(
            (numPrefix, idx) => `
          <p style="margin: 4px 0; line-height: 1.8;">
            <span style="font-weight: 600; color: #b91c1c; margin-right: 6px;">${numPrefix}</span> Elemento ${idx + 1}
          </p>
        `
          )
          .join('')}
      </div>
      <p><br /></p>
    `;

    insertHtmlAtCursor(listHtml);
    showToast(`Inserita lista: ${listDef.label.split('(')[0]}`);
  };

  // Load a document template
  const handleLoadTemplate = (templateId: string) => {
    const tmpl = DOCUMENT_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setContentHtml(tmpl.html);
      setResetTrigger((prev) => prev + 1);
      setPageSettings((prev) => ({
        ...prev,
        title: tmpl.name,
      }));
      showToast(`Modello "${tmpl.name}" caricato!`);
    }
  };

  // Clear document
  const handleClearDocument = () => {
    const emptyHtml = '<p><br /></p>';
    setContentHtml(emptyHtml);
    setResetTrigger((prev) => prev + 1);
    showToast('Nuovo documento vuoto pronto.');
  };

  // Export Direct PDF (jsPDF + html2canvas)
  const handleExportPdf = async () => {
    if (!editorRef.current) return;
    setIsExporting(true);
    try {
      await exportToPdf(editorRef.current, pageSettings, (msg) => {
        showToast(msg);
      });
      showToast('PDF generato e scaricato con successo!');
    } catch (err) {
      console.error(err);
      showToast('Errore durante la generazione PDF. Prova con "Stampa / PDF Vettoriale".');
    } finally {
      setIsExporting(false);
    }
  };

  // Print to PDF (Vector 100% crisp)
  const handlePrint = () => {
    showToast('Apertura finestra di stampa. Seleziona "Salva come PDF" per ottenere la massima nitidezza vettoriale.');
    setTimeout(() => {
      triggerPrintDialog();
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Application Toolbar */}
      <Toolbar
        onFormat={handleFormat}
        onApplyFont={handleApplyFont}
        onApplyFontSize={handleApplyFontSize}
        onApplyColor={handleApplyColor}
        onApplyBgColor={handleApplyBgColor}
        onApplyLineHeight={handleApplyLineHeight}
        onApplyLetterSpacing={handleApplyLetterSpacing}
        onInsertCjkList={handleInsertCjkList}
        onOpenRubyModal={() => {
          saveCurrentSelection();
          setIsRubyModalOpen(true);
        }}
        onConvertSelectionRuby={handleConvertSelectionRuby}
        onOpenImageModal={() => {
          saveCurrentSelection();
          setIsImageModalOpen(true);
        }}
        onOpenTableModal={() => {
          saveCurrentSelection();
          setIsTableModalOpen(true);
        }}
        pageSettings={pageSettings}
        onUpdatePageSettings={(settings) =>
          setPageSettings((prev) => ({ ...prev, ...settings }))
        }
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
        onLoadTemplate={handleLoadTemplate}
        onClearDocument={handleClearDocument}
        isExporting={isExporting}
      />

      {/* Editor Page Canvas */}
      <EditorCanvas
        contentHtml={contentHtml}
        onChangeContent={setContentHtml}
        pageSettings={pageSettings}
        editorRef={editorRef}
        printContainerRef={printContainerRef}
        resetTrigger={resetTrigger}
      />

      {/* Modals */}
      <RubyModal
        isOpen={isRubyModalOpen}
        onClose={() => setIsRubyModalOpen(false)}
        onInsertRuby={insertHtmlAtCursor}
        selectedText={selectedText}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={insertHtmlAtCursor}
      />

      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onInsertTable={insertHtmlAtCursor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 text-white px-4 py-2.5 shadow-2xl backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
