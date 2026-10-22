import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, MoveLeft, MoveRight, AlignCenter, Layers, Check, Sparkles } from 'lucide-react';
import { ART_PRESETS } from '../../utils/documentTemplates';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (imageHtml: string) => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage,
}) => {
  const [sourceType, setSourceType] = useState<'presets' | 'upload' | 'url'>('presets');
  const [imageUrl, setImageUrl] = useState(ART_PRESETS[0].url);
  const [position, setPosition] = useState<'left' | 'right' | 'center' | 'inline' | 'behind'>('right');
  const [widthPercent, setWidthPercent] = useState<number>(20);
  const [opacity, setOpacity] = useState<number>(100);
  const [caption, setCaption] = useState('');
  const [borderStyle, setBorderStyle] = useState<'none' | 'thin' | 'double' | 'seal'>('none');
  const [rounded, setRounded] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Ultra-fast client-side canvas compression: prevents browser tab freeze and localStorage crashes!
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1000;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setImageUrl(compressed);
        } else {
          setImageUrl(loadEvent.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => setIsProcessing(false);
      img.src = loadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!imageUrl) return;

    let borderCss = '';
    if (borderStyle === 'thin') {
      borderCss = 'border: 1px solid #cbd5e1;';
    } else if (borderStyle === 'double') {
      borderCss = 'border: 3px double #334155; padding: 2px;';
    } else if (borderStyle === 'seal') {
      borderCss = 'border: 3px solid #c23531;';
    }

    const borderRadiusCss = rounded ? 'border-radius: 6px;' : 'border-radius: 0px;';
    const opacityCss = opacity < 100 ? `opacity: ${opacity / 100};` : '';

    let wrapperHtml = '';

    if (position === 'left') {
      // Natural float left with text wrapping to the right, strictly constrained inside sheet
      wrapperHtml = `
        <div class="doc-image-wrapper doc-image-left" contenteditable="false" style="float: left; margin: 8px 20px 14px 0; max-width: ${widthPercent}%; width: ${widthPercent}%; clear: left; user-select: none;">
          <img src="${imageUrl}" alt="Immagine" style="width: 100%; height: auto; display: block; box-sizing: border-box; ${borderCss} ${borderRadiusCss} ${opacityCss}" />
          ${caption ? `<div style="font-size: 11px; text-align: center; color: #64748b; margin-top: 4px; font-style: italic;">${caption}</div>` : ''}
        </div>
      `;
    } else if (position === 'right') {
      // Natural float right with text wrapping to the left, strictly constrained inside sheet
      wrapperHtml = `
        <div class="doc-image-wrapper doc-image-right" contenteditable="false" style="float: right; margin: 8px 0 14px 20px; max-width: ${widthPercent}%; width: ${widthPercent}%; clear: right; user-select: none;">
          <img src="${imageUrl}" alt="Immagine" style="width: 100%; height: auto; display: block; box-sizing: border-box; ${borderCss} ${borderRadiusCss} ${opacityCss}" />
          ${caption ? `<div style="font-size: 11px; text-align: center; color: #64748b; margin-top: 4px; font-style: italic;">${caption}</div>` : ''}
        </div>
      `;
    } else if (position === 'center') {
      // Centered block inside sheet with typing continuation paragraph below
      wrapperHtml = `
        <div class="doc-image-wrapper doc-image-center" contenteditable="false" style="margin: 16px auto; text-align: center; clear: both; max-width: 100%; user-select: none;">
          <div style="display: inline-block; max-width: ${widthPercent}%; width: ${widthPercent}%;">
            <img src="${imageUrl}" alt="Immagine" style="width: 100%; height: auto; display: block; margin: 0 auto; box-sizing: border-box; ${borderCss} ${borderRadiusCss} ${opacityCss}" />
            ${caption ? `<div style="font-size: 11px; text-align: center; color: #64748b; margin-top: 4px; font-style: italic;">${caption}</div>` : ''}
          </div>
        </div>
        <p><br /></p>
      `;
    } else if (position === 'inline') {
      // Compact inline element for seals and stamps
      wrapperHtml = `
        <span class="doc-image-inline" contenteditable="false" style="display: inline-block; vertical-align: middle; margin: 0 6px; width: ${Math.min(widthPercent, 25)}%; max-width: 80px; min-width: 28px; user-select: none;">
          <img src="${imageUrl}" alt="Sigillo" style="width: 100%; height: auto; display: inline-block; box-sizing: border-box; ${borderCss} ${borderRadiusCss} ${opacityCss}" />
        </span>&nbsp;
      `;
    } else if (position === 'behind') {
      // Watermark strictly centered inside the A4 sheet page
      const watermarkOpacity = opacity < 100 ? opacity / 100 : 0.15;
      wrapperHtml = `
        <div class="doc-image-watermark" contenteditable="false" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); width: ${widthPercent}%; max-width: 85%; opacity: ${watermarkOpacity}; pointer-events: none; z-index: 0; user-select: none;">
          <img src="${imageUrl}" alt="Filigrana" style="width: 100%; height: auto; display: block; margin: 0 auto;" />
        </div>
      `;
    }

    onInsertImage(wrapperHtml);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dedicated backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-[95vw] max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 sm:px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <ImageIcon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Inserisci Immagine nel Documento
              </h3>
              <p className="text-xs text-slate-400">
                Posizionamento calibrato sempre all&apos;interno del foglio A4
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {/* Source Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setSourceType('presets')}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                sourceType === 'presets'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Elementi Tradizionali
            </button>
            <button
              type="button"
              onClick={() => setSourceType('upload')}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                sourceType === 'upload'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Carica da Dispositivo
            </button>
            <button
              type="button"
              onClick={() => setSourceType('url')}
              className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                sourceType === 'url'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              URL Web
            </button>
          </div>

          {/* Preset Selector */}
          {sourceType === 'presets' && (
            <div className="grid grid-cols-2 gap-2">
              {ART_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    if (preset.category === 'watermark') {
                      setPosition('behind');
                      setOpacity(20);
                      setWidthPercent(65);
                    } else if (preset.category === 'seal') {
                      setPosition('right');
                      setOpacity(100);
                      setWidthPercent(18);
                    } else if (preset.category === 'painting') {
                      setPosition('left');
                      setOpacity(100);
                      setWidthPercent(35);
                    }
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition ${
                    imageUrl === preset.url
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="h-16 w-16 object-contain rounded mb-1.5 bg-slate-50 p-1"
                  />
                  <span className="text-xs font-semibold text-slate-800">{preset.title}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Upload Area with Compression Indicator */}
          {sourceType === 'upload' && (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-6 text-center cursor-pointer hover:bg-indigo-50/70 transition"
              >
                <Upload className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-bold text-slate-800">
                  {isProcessing ? 'Ottimizzazione immagine in corso...' : "Fai clic per scegliere un'immagine"}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Ridimensionata e ottimizzata automaticamente per massima velocità
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {imageUrl && !isProcessing && (
                <div className="mt-3 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Anteprima caricata"
                    className="h-20 max-w-full object-contain rounded border border-slate-200 bg-white p-1"
                  />
                </div>
              )}
            </div>
          )}

          {/* URL Input */}
          {sourceType === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Indirizzo Web Immagine:
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
          )}

          {/* Position Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Posizione nel foglio:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPosition('left')}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  position === 'left'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MoveLeft className="h-4 w-4" />
                <span>Sinistra</span>
                <span className="text-[9px] text-slate-400 font-normal">Testo a destra</span>
              </button>

              <button
                type="button"
                onClick={() => setPosition('right')}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  position === 'right'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <MoveRight className="h-4 w-4" />
                <span>Destra</span>
                <span className="text-[9px] text-slate-400 font-normal">Testo a sinistra</span>
              </button>

              <button
                type="button"
                onClick={() => setPosition('center')}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  position === 'center'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlignCenter className="h-4 w-4" />
                <span>Centro</span>
                <span className="text-[9px] text-slate-400 font-normal">Blocco intero</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPosition('inline');
                  if (widthPercent > 25) setWidthPercent(18);
                }}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 ${
                  position === 'inline'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>In Linea</span>
                <span className="text-[9px] text-slate-400 font-normal">Sigillo / Icona</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPosition('behind');
                  if (opacity === 100) setOpacity(20);
                  if (widthPercent < 50) setWidthPercent(65);
                }}
                className={`p-2 rounded-lg border text-center transition flex flex-col items-center gap-1 col-span-2 sm:col-span-1 ${
                  position === 'behind'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Dietro</span>
                <span className="text-[9px] text-slate-400 font-normal">Filigrana foglio</span>
              </button>
            </div>
          </div>

          {/* Didascalia */}
          {position !== 'behind' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Didascalia (opzionale):
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Es. 水墨竹韵 (Pittura d'inchiostro tradizionale)"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Size & Opacity Slider */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Larghezza foglio:</span>
                <span className="text-indigo-600">{widthPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={widthPercent}
                onChange={(e) => setWidthPercent(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Opacità:</span>
                <span className="text-indigo-600">{opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Bordo e Stile */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Bordo:</span>
              <select
                value={borderStyle}
                onChange={(e) => setBorderStyle(e.target.value as any)}
                className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-800 bg-white"
              >
                <option value="none">Nessuno</option>
                <option value="thin">Sottile (#cbd5e1)</option>
                <option value="double">Doppio (#334155)</option>
                <option value="seal">Sigillo Rosso (#c23531)</option>
              </select>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rounded}
                onChange={(e) => setRounded(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span className="text-slate-700 font-medium">Bordi arrotondati</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            <Check className="h-4 w-4" />
            Inserisci nel Foglio
          </button>
        </div>
      </div>
    </div>
  );
};
