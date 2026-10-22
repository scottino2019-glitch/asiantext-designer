import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Palette,
  Highlighter,
  List,
  Table as TableIcon,
  Image as ImageIcon,
  FileDown,
  Printer,
  Sparkles,
  ChevronDown,
  Wand2,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { CJK_FONTS, CJK_COLOR_PRESETS, DocumentPageSettings } from '../../types/editor';
import { DOCUMENT_TEMPLATES } from '../../utils/documentTemplates';

interface ToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onApplyFont: (fontFamily: string, fontName: string) => void;
  onApplyFontSize: (sizePx: string) => void;
  onApplyColor: (color: string) => void;
  onApplyBgColor: (color: string) => void;
  onApplyLineHeight?: (height: string) => void;
  onApplyLetterSpacing?: (spacing: string) => void;
  onInsertCjkList: (listTypeId: string) => void;
  onOpenRubyModal: () => void;
  onConvertSelectionRuby: () => void;
  onOpenImageModal: () => void;
  onOpenTableModal: () => void;
  pageSettings: DocumentPageSettings;
  onUpdatePageSettings: (settings: Partial<DocumentPageSettings>) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onLoadTemplate: (templateId: string) => void;
  onClearDocument: () => void;
  isExporting: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFormat,
  onApplyFont,
  onApplyFontSize,
  onApplyColor,
  onApplyBgColor,
  onInsertCjkList,
  onOpenRubyModal,
  onConvertSelectionRuby,
  onOpenImageModal,
  onOpenTableModal,
  pageSettings,
  onUpdatePageSettings,
  onExportPdf,
  onPrint,
  onLoadTemplate,
  onClearDocument,
  isExporting,
}) => {
  const [selectedFontName, setSelectedFontName] = useState('Noto Serif SC');
  const [currentFontSizeNum, setCurrentFontSizeNum] = useState(16);
  const [activeMenu, setActiveMenu] = useState<'font' | 'size' | 'color' | 'bg' | 'list' | 'template' | null>(null);

  const toolbarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMenu = (menu: 'font' | 'size' | 'color' | 'bg' | 'list' | 'template') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48];

  const handleStepSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(64, currentFontSizeNum + delta));
    setCurrentFontSizeNum(newSize);
    onApplyFontSize(`${newSize}px`);
  };

  return (
    <div
      ref={toolbarRef}
      className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 sticky top-0 z-50 select-none shadow-xl no-print overflow-visible"
    >
      {/* Sleek single row: NO overflow-hidden, so dropdowns float ON TOP of Canvas */}
      <div className="flex flex-wrap items-center justify-between px-2 sm:px-4 py-1.5 gap-1.5 relative overflow-visible">
        {/* Left: Brand & Templates */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-xs shadow-xs">
            書
          </div>
          <span className="font-bold text-white text-xs hidden lg:inline mr-1">
            CJK DocCraft
          </span>

          {/* Templates Dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleMenu('template')}
              className="flex items-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300 border border-slate-700"
              title="Carica modelli cinesi o coreani predefiniti"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span className="hidden sm:inline">Modelli</span>
              <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
            </button>

            {activeMenu === 'template' && (
              <div className="absolute left-0 top-full mt-1.5 w-72 rounded-lg border border-slate-700 bg-slate-800 p-1.5 shadow-2xl z-[100] animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
                  Scegli Modello
                </div>
                {DOCUMENT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onLoadTemplate(tmpl.id);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left rounded-md p-2 text-xs hover:bg-slate-700 text-slate-200 transition"
                  >
                    <div className="font-semibold text-white">{tmpl.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{tmpl.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Center-Left: Custom Font Dropdown (NEVER steals focus) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Custom Font Picker Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleMenu('font')}
              className="flex items-center justify-between gap-1.5 rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs font-semibold text-white w-32 sm:w-44 truncate"
              title="Scegli carattere corsivo o stampatello"
            >
              <span className="truncate">{selectedFontName}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>

            {activeMenu === 'font' && (
              <div className="absolute left-0 top-full mt-1.5 w-64 max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-2xl z-[100] text-xs animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-red-400 px-2 py-1 uppercase border-b border-slate-700/60">
                  🇨🇳 Cinese Corsivo & Calligrafia
                </div>
                {CJK_FONTS.filter((f) => f.category === 'chinese-cursive').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedFontName(f.name);
                      onApplyFont(f.family, f.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span style={{ fontFamily: f.family }} className="text-sm">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{f.nativeName}</span>
                  </button>
                ))}

                <div className="text-[10px] font-bold text-amber-400 px-2 py-1 uppercase border-b border-slate-700/60 mt-1">
                  🇨🇳 Cinese Stampatello
                </div>
                {CJK_FONTS.filter((f) => f.category === 'chinese-print').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedFontName(f.name);
                      onApplyFont(f.family, f.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span style={{ fontFamily: f.family }}>{f.name}</span>
                    <span className="text-[10px] text-slate-400">{f.nativeName}</span>
                  </button>
                ))}

                <div className="text-[10px] font-bold text-blue-400 px-2 py-1 uppercase border-b border-slate-700/60 mt-1">
                  🇰🇷 Coreano Corsivo & Calligrafia
                </div>
                {CJK_FONTS.filter((f) => f.category === 'korean-cursive').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedFontName(f.name);
                      onApplyFont(f.family, f.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span style={{ fontFamily: f.family }} className="text-sm">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{f.nativeName}</span>
                  </button>
                ))}

                <div className="text-[10px] font-bold text-indigo-400 px-2 py-1 uppercase border-b border-slate-700/60 mt-1">
                  🇰🇷 Coreano Stampatello
                </div>
                {CJK_FONTS.filter((f) => f.category === 'korean-print').map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedFontName(f.name);
                      onApplyFont(f.family, f.name);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-between"
                  >
                    <span style={{ fontFamily: f.family }}>{f.name}</span>
                    <span className="text-[10px] text-slate-400">{f.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Size Stepper & Dropdown (NEVER steals focus) */}
          <div className="flex items-center rounded-md border border-slate-700 bg-slate-800 p-0.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleStepSize(-2)}
              title="Riduci dimensione font (A-)"
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            >
              <Minus className="h-3 w-3" />
            </button>

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleMenu('size')}
                className="px-1.5 py-0.5 text-xs font-bold text-white hover:bg-slate-700 rounded"
                title="Scegli dimensione esatta"
              >
                {currentFontSizeNum}px
              </button>

              {activeMenu === 'size' && (
                <div className="absolute left-0 top-full mt-1.5 w-20 max-h-48 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-1 shadow-2xl z-[100]">
                  {fontSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setCurrentFontSizeNum(sz);
                        onApplyFontSize(`${sz}px`);
                        setActiveMenu(null);
                      }}
                      className="w-full text-center py-1 rounded text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleStepSize(2)}
              title="Aumenta dimensione font (A+)"
              className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Center: Formatting Buttons (B, I, U, Color, Highlight) */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onFormat('bold')}
            title="Grassetto"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onFormat('italic')}
            title="Corsivo"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onFormat('underline')}
            title="Sottolineato"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <Underline className="h-3.5 w-3.5" />
          </button>

          {/* Color Picker Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleMenu('color')}
              title="Colore testo tradizionale"
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <Palette className="h-3.5 w-3.5 text-red-400" />
            </button>

            {activeMenu === 'color' && (
              <div className="absolute left-0 top-full mt-1.5 w-56 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-2xl z-[100] animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Colori Tradizionali:</div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {CJK_COLOR_PRESETS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onApplyColor(c.hex);
                        setActiveMenu(null);
                      }}
                      style={{ backgroundColor: c.hex }}
                      className="h-6 w-full rounded border border-white/20 hover:scale-105 transition"
                      title={c.name}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-1.5">
                  <span className="text-[10px] text-slate-400">Personalizzato:</span>
                  <input
                    type="color"
                    onChange={(e) => onApplyColor(e.target.value)}
                    className="h-5 w-6 cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleMenu('bg')}
              title="Evidenziatore"
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <Highlighter className="h-3.5 w-3.5 text-amber-400" />
            </button>

            {activeMenu === 'bg' && (
              <div className="absolute left-0 top-full mt-1.5 w-48 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-2xl z-[100] animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-slate-400 mb-1">Evidenziazione:</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {['#fef08a', '#bbf7d0', '#bae6fd', '#fbcfe8', '#fed7aa', 'transparent'].map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onApplyBgColor(bg);
                        setActiveMenu(null);
                      }}
                      style={{ backgroundColor: bg }}
                      className="h-5 w-full rounded border border-slate-600 text-[10px] text-slate-900 font-bold"
                    >
                      {bg === 'transparent' ? '✕' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Center-Right: CJK Features (Pinyin Auto, Ruby, CJK Lists, Image, Table) */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick 1-Click Pinyin / Ruby Generator */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onConvertSelectionRuby}
            title="Aggiunge Pinyin automatico su tutto il testo selezionato in un solo clic"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Wand2 className="h-3 w-3" />
            <span>Pinyin Auto</span>
          </button>

          {/* Ruby Modal button */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onOpenRubyModal}
            title="Apri convertitore Ruby per inserire interi testi"
            className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            Ruby...
          </button>

          {/* CJK Lists dropdown */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggleMenu('list')}
              title="Liste numerate cinesi e coreane"
              className="flex items-center gap-1 rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-1 text-xs text-slate-300 border border-slate-700"
            >
              <List className="h-3 w-3 text-red-400" />
              <span className="hidden md:inline">Liste CJK</span>
              <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
            </button>

            {activeMenu === 'list' && (
              <div className="absolute left-0 top-full mt-1.5 w-60 rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-2xl z-[100] animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-bold text-red-400 mb-1">🇨🇳 Cinese:</div>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('cn-numerals');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-red-900/60 text-white"
                  >
                    一、二、三
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('cn-circled');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-red-900/60 text-white"
                  >
                    ① ② ③
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('cn-parentheses');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-red-900/60 text-white"
                  >
                    ㈠ ㈡ ㈢
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('cn-stems');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-red-900/60 text-white"
                  >
                    甲、乙、丙
                  </button>
                </div>

                <div className="text-[10px] font-bold text-blue-400 mb-1 border-t border-slate-700 pt-1">
                  🇰🇷 Coreano:
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('kr-syllables');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-blue-900/60 text-white"
                  >
                    가. 나. 다.
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('kr-consonants');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-blue-900/60 text-white"
                  >
                    ㄱ. ㄴ. ㄷ.
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('kr-circled-syllables');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-blue-900/60 text-white"
                  >
                    ㉮ ㉯ ㉰
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onInsertCjkList('kr-steps');
                      setActiveMenu(null);
                    }}
                    className="p-1 rounded bg-slate-700 text-xs text-left hover:bg-blue-900/60 text-white"
                  >
                    1단계: (Fasi)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onOpenTableModal}
            title="Inserisci tabella o griglia 田字格"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <TableIcon className="h-3.5 w-3.5 text-emerald-400" />
          </button>

          {/* Image */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onOpenImageModal}
            title="Inserisci immagine con testo fluido"
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
          >
            <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Right: Print, PDF, Clear */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Print / Vector PDF */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onPrint}
            title="Stampa / Salva come PDF Vettoriale (100% nitido, senza rasterizzazione)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition active:scale-95"
          >
            <Printer className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Stampa / PDF HD</span>
          </button>

          {/* Direct Download PDF */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 text-xs transition active:scale-95 disabled:opacity-50 shadow-xs"
            title="Scarica direttamente il file PDF A4 sul dispositivo"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{isExporting ? 'Generazione...' : 'Scarica PDF'}</span>
          </button>

          {/* Clear */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClearDocument}
            title="Svuota foglio per iniziare da zero"
            className="p-1.5 text-slate-500 hover:text-red-400 rounded-md hover:bg-slate-800 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
