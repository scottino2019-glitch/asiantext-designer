import React, { useState, useEffect, useRef } from 'react';
import { DocumentPageSettings } from '../../types/editor';
import { MoveLeft, MoveRight, AlignCenter, Trash2, ZoomIn, ZoomOut, X } from 'lucide-react';

interface EditorCanvasProps {
  contentHtml: string;
  onChangeContent: (html: string) => void;
  pageSettings: DocumentPageSettings;
  editorRef: React.RefObject<HTMLDivElement | null>;
  printContainerRef: React.RefObject<HTMLDivElement | null>;
  resetTrigger?: number;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  contentHtml,
  onChangeContent,
  pageSettings,
  editorRef,
  printContainerRef,
  resetTrigger,
}) => {
  const [stats, setStats] = useState({
    cjkChars: 0,
    words: 0,
  });

  // Selected image state for direct on-canvas positioning and sizing
  const [activeImageWrapper, setActiveImageWrapper] = useState<HTMLElement | null>(null);
  const [imageBarPos, setImageBarPos] = useState<{ top: number; left: number } | null>(null);
  const imageBarRef = useRef<HTMLDivElement>(null);

  const calculateStats = (text: string) => {
    const cjkMatches = text.match(/[\u4e00-\u9fa5\uac00-\ud7af\u3040-\u30ff]/g);
    const cjkCount = cjkMatches ? cjkMatches.length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setStats({
      cjkChars: cjkCount,
      words: words,
    });
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || '';
      onChangeContent(html);
      calculateStats(text);
    }
  };

  // Synchronize HTML when template loads or document is cleared
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = contentHtml;
      calculateStats(editorRef.current.innerText || '');
      setActiveImageWrapper(null);
      setImageBarPos(null);
    }
  }, [resetTrigger]);

  // Initial load
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = contentHtml;
      calculateStats(editorRef.current.innerText || '');
    }
  }, []);

  // Handle click on images inside the editor to allow direct alignment / resize / removal
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!editorRef.current) return;

    // Check if clicked an image or image wrapper
    const imgWrapper = target.closest('.doc-image-wrapper, .img-wrap-left, .img-wrap-right, .img-wrap-center, .doc-image-watermark, .doc-image-inline') as HTMLElement | null;
    const rawImg = target.tagName === 'IMG' ? target : null;
    const targetEl = imgWrapper || rawImg;

    if (targetEl && editorRef.current.contains(targetEl)) {
      setActiveImageWrapper(targetEl);

      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = printContainerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setImageBarPos({
          top: Math.max(8, targetRect.top - containerRect.top - 46),
          left: Math.max(12, Math.min(containerRect.width - 280, targetRect.left - containerRect.left + (targetRect.width / 2) - 130)),
        });
      }
    } else {
      // Dismiss if clicking outside image and outside toolbar
      if (imageBarRef.current && imageBarRef.current.contains(target)) return;
      setActiveImageWrapper(null);
      setImageBarPos(null);
    }
  };

  // Direct image alignment actions
  const applyImageAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (!activeImageWrapper || !editorRef.current) return;

    // Remove old alignment classes
    activeImageWrapper.classList.remove('doc-image-left', 'doc-image-right', 'doc-image-center', 'img-wrap-left', 'img-wrap-right', 'img-wrap-center');

    if (alignment === 'left') {
      activeImageWrapper.classList.add('doc-image-left');
      activeImageWrapper.style.float = 'left';
      activeImageWrapper.style.clear = 'left';
      activeImageWrapper.style.margin = '8px 20px 14px 0';
      activeImageWrapper.style.textAlign = 'left';
      activeImageWrapper.style.display = 'block';
    } else if (alignment === 'right') {
      activeImageWrapper.classList.add('doc-image-right');
      activeImageWrapper.style.float = 'right';
      activeImageWrapper.style.clear = 'right';
      activeImageWrapper.style.margin = '8px 0 14px 20px';
      activeImageWrapper.style.textAlign = 'right';
      activeImageWrapper.style.display = 'block';
    } else {
      activeImageWrapper.classList.add('doc-image-center');
      activeImageWrapper.style.float = 'none';
      activeImageWrapper.style.clear = 'both';
      activeImageWrapper.style.margin = '16px auto';
      activeImageWrapper.style.textAlign = 'center';
      activeImageWrapper.style.display = 'block';
    }

    handleInput();
    // Update toolbar position
    setTimeout(() => {
      if (activeImageWrapper && printContainerRef.current) {
        const targetRect = activeImageWrapper.getBoundingClientRect();
        const containerRect = printContainerRef.current.getBoundingClientRect();
        setImageBarPos({
          top: Math.max(8, targetRect.top - containerRect.top - 46),
          left: Math.max(12, Math.min(containerRect.width - 280, targetRect.left - containerRect.left + (targetRect.width / 2) - 130)),
        });
      }
    }, 50);
  };

  // Adjust image size directly
  const adjustImageSize = (deltaPercent: number) => {
    if (!activeImageWrapper || !editorRef.current) return;

    const currentStyleWidth = activeImageWrapper.style.width || activeImageWrapper.style.maxWidth;
    let currentVal = 30;
    if (currentStyleWidth && currentStyleWidth.includes('%')) {
      currentVal = parseInt(currentStyleWidth, 10) || 30;
    }

    const newVal = Math.max(12, Math.min(90, currentVal + deltaPercent));
    activeImageWrapper.style.width = `${newVal}%`;
    activeImageWrapper.style.maxWidth = `${newVal}%`;

    const innerImg = activeImageWrapper.querySelector('img') || (activeImageWrapper.tagName === 'IMG' ? activeImageWrapper as HTMLImageElement : null);
    if (innerImg) {
      innerImg.style.maxWidth = '100%';
    }

    handleInput();
  };

  // Delete active image
  const deleteActiveImage = () => {
    if (!activeImageWrapper || !editorRef.current) return;
    activeImageWrapper.remove();
    setActiveImageWrapper(null);
    setImageBarPos(null);
    handleInput();
  };

  // Handle pasted images so they never overflow sheet
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvent) => {
            const dataUrl = loadEvent.target?.result as string;
            if (dataUrl && editorRef.current) {
              const imgHtml = `
                <div class="doc-image-wrapper doc-image-center" contenteditable="false" style="margin: 16px auto; text-align: center; clear: both; max-width: 100%; user-select: none;">
                  <div style="display: inline-block; max-width: 55%; width: 55%;">
                    <img src="${dataUrl}" alt="Immagine incollata" style="width: 100%; height: auto; display: block; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.12);" />
                  </div>
                </div>
                <p><br /></p>
              `;
              document.execCommand('insertHTML', false, imgHtml);
              handleInput();
            }
          };
          reader.readAsDataURL(file);
        }
        return;
      }
    }
  };

  // Exact A4 dimensions in pixels at 96 DPI:
  // Portrait: 794px width x 1123px height (210mm x 297mm, ratio 1 : 1.4142)
  // Landscape: 1123px width x 794px height (297mm x 210mm, ratio 1.4142 : 1)
  const isPortrait = pageSettings.orientation === 'portrait';
  const zoomFactor = (pageSettings.zoom || 100) / 100;

  const baseWidth = isPortrait ? 794 : 1123;
  const baseMinHeight = isPortrait ? 1123 : 794;

  const currentWidthPx = Math.round(baseWidth * zoomFactor);
  const currentMinHeightPx = Math.round(baseMinHeight * zoomFactor);

  return (
    <div className="flex-1 bg-slate-900 overflow-y-auto px-2 py-4 sm:p-6 flex flex-col items-center print-page-container">
      {/* Discreet Document Info Bar */}
      <div
        className="w-full mb-2 flex items-center justify-between text-xs text-slate-400 no-print px-1 select-none"
        style={{ maxWidth: `${currentWidthPx}px` }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-700">
            A4 {isPortrait ? '210×297 mm' : '297×210 mm'} ({pageSettings.zoom || 100}%)
          </span>
          <span className="text-[11px]">
            Caratteri CJK: <strong className="text-red-400">{stats.cjkChars}</strong>
          </span>
          <span className="text-[11px] hidden sm:inline">
            Parole: <strong className="text-slate-200">{stats.words}</strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Formato A4 reale ・ 210 × 297 mm
        </span>
      </div>

      {/* The Printable Page Sheet - Exact A4 Dimensions */}
      <div
        ref={printContainerRef}
        className="w-full print-page-wrapper mb-16 transition-all duration-150 flex justify-center relative"
        style={{ maxWidth: `${currentWidthPx}px` }}
      >
        {/* Floating contextual action bar when user clicks an image on canvas */}
        {activeImageWrapper && imageBarPos && (
          <div
            ref={imageBarRef}
            className="absolute z-30 no-print flex items-center gap-1 bg-slate-900/95 text-white border border-slate-700 rounded-lg p-1 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100 select-none"
            style={{
              top: `${imageBarPos.top}px`,
              left: `${imageBarPos.left}px`,
            }}
          >
            <span className="text-[10px] text-slate-400 px-1 font-semibold border-r border-slate-800 mr-0.5">
              Immagine:
            </span>
            <button
              type="button"
              onClick={() => applyImageAlignment('left')}
              title="Allinea a Sinistra (Testo a destra)"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            >
              <MoveLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyImageAlignment('center')}
              title="Allinea al Centro"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyImageAlignment('right')}
              title="Allinea a Destra (Testo a sinistra)"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            >
              <MoveRight className="h-3.5 w-3.5" />
            </button>

            <span className="w-px h-3 bg-slate-800 mx-0.5" />

            <button
              type="button"
              onClick={() => adjustImageSize(-8)}
              title="Riduci dimensione (-8%)"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => adjustImageSize(8)}
              title="Ingrandisci dimensione (+8%)"
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <span className="w-px h-3 bg-slate-800 mx-0.5" />

            <button
              type="button"
              onClick={deleteActiveImage}
              title="Rimuovi immagine dal foglio"
              className="p-1 hover:bg-red-950 text-red-400 hover:text-red-300 rounded transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveImageWrapper(null);
                setImageBarPos(null);
              }}
              title="Chiudi menu"
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition ml-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onClick={handleEditorClick}
          onPaste={handlePaste}
          className="w-full bg-white text-slate-900 rounded-sm shadow-2xl shadow-black/80 border border-slate-300 print-page outline-none leading-relaxed cursor-text selection:bg-red-200 selection:text-red-950 relative"
          style={{
            position: 'relative',
            minHeight: `${currentMinHeightPx}px`,
            padding: isPortrait ? '44px 50px' : '40px 50px',
            fontFamily: "'Noto Serif SC', 'Nanum Myeongjo', serif",
            fontSize: '15px',
            lineHeight: 1.8,
            writingMode: 'horizontal-tb',
            direction: 'ltr',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          }}
        />
      </div>
    </div>
  );
};
