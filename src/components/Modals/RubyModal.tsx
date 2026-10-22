import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Check, Wand2, FileText, ArrowRight } from 'lucide-react';
import { PINYIN_TONES_MAP } from '../../utils/cjkLists';
import { convertChineseToRubyBatch, convertHanjaToRubyBatch } from '../../utils/pinyinEngine';

interface RubyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertRuby: (rubyHtml: string) => void;
  selectedText?: string;
}

const SAMPLE_TEXTS = [
  {
    id: 'chun-xiao',
    title: '🇨🇳 Poesia: 春晓 (Risveglio di Primavera)',
    author: 'Meng Haoran (Dinastia Tang)',
    text: '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
    lang: 'zh' as const,
  },
  {
    id: 'jing-ye-si',
    title: '🇨🇳 Poesia: 静夜思 (Pensieri nella Notte Tranquilla)',
    author: 'Li Bai (Dinastia Tang)',
    text: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    lang: 'zh' as const,
  },
  {
    id: 'chinese-phrases',
    title: '🇨🇳 Conversazione Base Cinese',
    author: 'Vocabolario fondamentale',
    text: '你好！欢迎来到中文世界。\n今天天气很好，学习汉字很有趣。',
    lang: 'zh' as const,
  },
  {
    id: 'korean-hanja',
    title: '🇰🇷 Coreano: Hanja con pronuncia Hangul',
    author: 'Caratteri sinocoreani fondamentali',
    text: '學校 先生 學生 韓國 父母 時間 家族 文化',
    lang: 'ko' as const,
  },
];

export const RubyModal: React.FC<RubyModalProps> = ({
  isOpen,
  onClose,
  onInsertRuby,
  selectedText = '',
}) => {
  const [activeTab, setActiveTab] = useState<'batch' | 'manual'>('batch');
  const [batchText, setBatchText] = useState(
    selectedText || SAMPLE_TEXTS[0].text
  );
  const [batchLang, setBatchLang] = useState<'zh' | 'ko'>('zh');
  const [convertedPreviewHtml, setConvertedPreviewHtml] = useState('');

  // Single word state
  const [baseText, setBaseText] = useState(selectedText || '你好');
  const [rubyText, setRubyText] = useState('nǐ hǎo');

  useEffect(() => {
    if (selectedText) {
      setBatchText(selectedText);
      setBaseText(selectedText);
    }
  }, [selectedText]);

  // Update batch preview
  useEffect(() => {
    if (batchLang === 'zh') {
      setConvertedPreviewHtml(convertChineseToRubyBatch(batchText));
    } else {
      setConvertedPreviewHtml(convertHanjaToRubyBatch(batchText));
    }
  }, [batchText, batchLang]);

  if (!isOpen) return null;

  const handleInsertTone = (tone: string) => {
    setRubyText((prev) => prev + tone);
  };

  const handleSelectSample = (sample: typeof SAMPLE_TEXTS[0]) => {
    setBatchLang(sample.lang);
    setBatchText(sample.text);
  };

  const handleConfirmBatch = () => {
    onInsertRuby(convertedPreviewHtml);
    onClose();
  };

  const handleConfirmManual = () => {
    const html = `<ruby>${baseText}<rt>${rubyText}</rt></ruby>`;
    onInsertRuby(html);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Dedicated backdrop - clicking backdrop closes modal, clicking inside NEVER closes! */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog: Guaranteed wide size (w-[95vw] max-w-2xl), never shrinks */}
      <div className="relative z-10 w-[96vw] max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col my-auto max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 sm:px-6 py-3.5 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white font-bold text-sm shadow-xs">
              ル
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base leading-tight">
                Generatore Automatico Ruby (Pinyin & Hangul)
              </h3>
              <p className="text-[11px] text-slate-400">
                Incolla frasi, poesie o interi testi per generare la pronuncia sopra ai caratteri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 py-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'batch'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Converti Intero Testo / Poesia (Automatico)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 py-2.5 px-3 sm:px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'manual'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Singolo Vocabolo</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {activeTab === 'batch' ? (
            <div className="space-y-4">
              {/* Language Switch */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Scrivi o incolla il tuo testo:
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 font-medium mr-1">Lingua:</span>
                  <button
                    type="button"
                    onClick={() => setBatchLang('zh')}
                    className={`px-3 py-1 rounded-md font-bold transition ${
                      batchLang === 'zh'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    🇨🇳 Cinese (Pinyin)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBatchLang('ko')}
                    className={`px-3 py-1 rounded-md font-bold transition ${
                      batchLang === 'ko'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    🇰🇷 Coreano (Hangul)
                  </button>
                </div>
              </div>

              {/* Textarea for entire text - High visibility, easy to type in */}
              <div>
                <textarea
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder="Scrivi o incolla qui qualsiasi testo in caratteri cinesi o coreani..."
                  rows={4}
                  className="w-full rounded-xl border-2 border-slate-300 p-3 text-sm text-slate-900 font-serif leading-relaxed focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none bg-white min-h-[100px]"
                />
              </div>

              {/* VISIBLE Sample Test Texts Cards - clearly visible and clickable */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Testi di Prova Pronti (Clicca per provare subito):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SAMPLE_TEXTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`text-left p-2.5 rounded-xl border transition ${
                        batchText === sample.text
                          ? 'border-red-600 bg-red-50/70 ring-1 ring-red-400'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>{sample.title}</span>
                      </div>
                      <div className="text-[11px] font-serif text-slate-600 line-clamp-1 mt-1 font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {sample.text.replace('\n', ' / ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Converted Preview */}
              <div className="rounded-xl border border-red-200 bg-red-50/40 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase font-bold text-red-800 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-red-600" />
                    Anteprima Ruby Generata:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Pronuncia generata sopra a ogni carattere
                  </span>
                </div>
                <div
                  className="bg-white p-3 rounded-lg border border-red-200 text-lg font-serif text-slate-900 leading-loose min-h-[70px] max-h-[140px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: convertedPreviewHtml || '<span class="text-slate-400 text-xs">Digita o scegli un testo sopra per vedere l\'anteprima</span>' }}
                />
              </div>
            </div>
          ) : (
            /* Single Word Manual Tab */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Carattere Cinese o Hanja:
                </label>
                <input
                  type="text"
                  value={baseText}
                  onChange={(e) => setBaseText(e.target.value)}
                  placeholder="Es. 你好"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base text-slate-900 font-serif focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pronuncia (Pinyin con toni o Hangul):
                </label>
                <input
                  type="text"
                  value={rubyText}
                  onChange={(e) => setRubyText(e.target.value)}
                  placeholder="Es. nǐ hǎo"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 outline-none"
                />
              </div>

              {/* Tone Keyboard */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-red-600" />
                  Accenti Pinyin Rapidi:
                </div>
                <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  {PINYIN_TONES_MAP.map((group) => (
                    <div key={group.base} className="flex items-center gap-1.5">
                      <span className="w-5 text-center text-xs font-bold text-slate-400">
                        {group.base}:
                      </span>
                      <div className="flex gap-1">
                        {group.tones.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleInsertTone(t)}
                            className="h-6 w-7 rounded bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-lg text-center text-xl">
                <ruby>
                  {baseText}
                  <rt className="text-red-700 text-xs font-semibold">{rubyText}</rt>
                </ruby>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 sm:px-6 py-3 shrink-0">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Tutto il testo verrà inserito con annotazioni Ruby sopra ai caratteri.
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={activeTab === 'batch' ? handleConfirmBatch : handleConfirmManual}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 active:scale-95 transition"
            >
              <Check className="h-4 w-4" />
              <span>Inserisci nel Foglio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
