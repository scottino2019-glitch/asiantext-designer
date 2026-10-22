import React, { useState } from 'react';
import { X, Table as TableIcon, Check, Grid, Plus, Minus } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTable: (tableHtml: string) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onInsertTable,
}) => {
  // Use string state so user can freely delete (backspace) and retype!
  const [rows, setRows] = useState<string>('3');
  const [cols, setCols] = useState<string>('3');
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [tableStyle, setTableStyle] = useState<'standard' | 'ink' | 'cinnabar' | 'tianzige'>('standard');

  if (!isOpen) return null;

  const handleStepRows = (delta: number) => {
    const current = parseInt(rows) || 1;
    const updated = Math.max(1, Math.min(25, current + delta));
    setRows(String(updated));
  };

  const handleStepCols = (delta: number) => {
    const current = parseInt(cols) || 1;
    const updated = Math.max(1, Math.min(8, current + delta));
    setCols(String(updated));
  };

  const handleQuickPreset = (r: number, c: number) => {
    setRows(String(r));
    setCols(String(Math.min(8, c)));
  };

  const handleConfirm = () => {
    const finalRows = Math.max(1, Math.min(30, parseInt(rows) || 3));
    // Max 8 columns to guarantee table NEVER overflows A4 page width
    const finalCols = Math.max(1, Math.min(8, parseInt(cols) || 3));

    let html = '';

    if (tableStyle === 'tianzige') {
      // Tianzige / Mizige character practice grid (田字格)
      const tianCols = Math.min(finalCols, 8); // Max 8 columns to fit cleanly on paper
      const tianRows = Math.min(finalRows, 12);
      html = `
        <div class="table-container" style="margin: 1.25rem auto; text-align: center; max-width: 100%; overflow: hidden;">
          <table style="display: inline-table; border-collapse: collapse; margin: 0 auto; background: white; max-width: 100%;">
            <tbody>
              ${Array.from({ length: tianRows })
                .map(
                  () => `
                <tr>
                  ${Array.from({ length: tianCols })
                    .map(
                      () => `
                    <td style="width: 38px; height: 38px; min-width: 34px; border: 1.5px solid #dc2626; padding: 0; text-align: center; vertical-align: middle; line-height: 38px; font-family: 'Noto Serif SC', serif; font-size: 22px; color: #1e293b; background-image: linear-gradient(to right, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%), linear-gradient(to bottom, transparent 49%, rgba(220, 38, 38, 0.3) 50%, transparent 51%);"></td>
                  `
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <p style="font-size: 11px; color: #64748b; margin-top: 6px;">Griglia 田字格 per calligrafia</p>
        </div>
        <p><br /></p>
      `;
    } else {
      let headerBg = '#f1f5f9';
      let headerColor = '#1e293b';
      let borderColor = '#cbd5e1';

      if (tableStyle === 'ink') {
        headerBg = '#1e293b';
        headerColor = '#ffffff';
        borderColor = '#94a3b8';
      } else if (tableStyle === 'cinnabar') {
        headerBg = '#c23531';
        headerColor = '#ffffff';
        borderColor = '#fca5a5';
      }

      const colWidthPercent = (100 / finalCols).toFixed(2);

      let headerHtml = '';
      if (hasHeader) {
        headerHtml = `
          <thead>
            <tr style="background-color: ${headerBg}; color: ${headerColor};">
              ${Array.from({ length: finalCols })
                .map(
                  (_, i) =>
                    `<th style="border: 1px solid ${borderColor}; padding: 6px 8px; text-align: left; font-weight: 600; width: ${colWidthPercent}%; box-sizing: border-box; overflow: hidden; word-break: break-word; overflow-wrap: anywhere; font-size: 13px;">Col ${i + 1}</th>`
                )
                .join('')}
            </tr>
          </thead>
        `;
      }

      const bodyHtml = `
        <tbody>
          ${Array.from({ length: finalRows })
            .map(
              () => `
            <tr>
              ${Array.from({ length: finalCols })
                .map(
                  () =>
                    `<td style="border: 1px solid ${borderColor}; padding: 6px 8px; width: ${colWidthPercent}%; box-sizing: border-box; overflow: hidden; word-break: break-word; overflow-wrap: anywhere; font-size: 13px;">Cella</td>`
                )
                .join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      `;

      html = `
        <div class="table-container" style="width: 100%; max-width: 100%; overflow-x: auto; margin: 1rem 0; box-sizing: border-box;">
          <table class="doc-table" style="width: 100% !important; max-width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; margin: 0; font-size: 13px; box-sizing: border-box !important;">
            ${headerHtml}
            ${bodyHtml}
          </table>
        </div>
        <p><br /></p>
      `;
    }

    onInsertTable(html);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dedicated backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog: Guaranteed width, never collapses */}
      <div className="relative z-10 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 sm:px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-xs">
              <TableIcon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Inserisci Tabella
              </h3>
              <p className="text-xs text-slate-400">
                Imposta righe e colonne liberamente
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
        <div className="p-6 space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Dimensioni Rapide:
            </label>
            <div className="flex gap-2">
              {[
                { r: 2, c: 2, label: '2 × 2' },
                { r: 3, c: 3, label: '3 × 3' },
                { r: 4, c: 2, label: '4 × 2' },
                { r: 5, c: 4, label: '5 × 4' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleQuickPreset(p.r, p.c)}
                  className={`flex-1 py-1 rounded-md text-xs font-semibold border transition ${
                    rows === String(p.r) && cols === String(p.c)
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rows & Cols Inputs with Steppers (Freely editable!) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numero di Righe:
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden focus-within:border-emerald-500">
                <button
                  type="button"
                  onClick={() => handleStepRows(-1)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                  placeholder="3"
                  className="w-full text-center py-2 text-sm text-slate-900 font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleStepRows(1)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Numero Colonne (max 8):
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden focus-within:border-emerald-500">
                <button
                  type="button"
                  onClick={() => handleStepCols(-1)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={cols}
                  onChange={(e) => setCols(e.target.value)}
                  placeholder="3"
                  className="w-full text-center py-2 text-sm text-slate-900 font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleStepCols(1)}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Stile Grafico:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTableStyle('standard')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  tableStyle === 'standard'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Classica Grigia</div>
                <div className="text-[10px] text-slate-500">Standard neutra</div>
              </button>

              <button
                type="button"
                onClick={() => setTableStyle('ink')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  tableStyle === 'ink'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Inchiostro (墨)</div>
                <div className="text-[10px] text-slate-500">Testata scura</div>
              </button>

              <button
                type="button"
                onClick={() => setTableStyle('cinnabar')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  tableStyle === 'cinnabar'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold">Rosso Cinabro (朱砂)</div>
                <div className="text-[10px] text-slate-500">Testata rossa</div>
              </button>

              <button
                type="button"
                onClick={() => setTableStyle('tianzige')}
                className={`p-2.5 rounded-lg border text-left transition ${
                  tableStyle === 'tianzige'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold ring-1 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold flex items-center gap-1">
                  <Grid className="h-3 w-3 text-red-600" />
                  Griglia Tianzige
                </div>
                <div className="text-[10px] text-slate-500">Celle per calligrafia</div>
              </button>
            </div>
          </div>

          {tableStyle !== 'tianzige' && (
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(e) => setHasHeader(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              Includi riga di intestazione (Header)
            </label>
          )}
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition"
          >
            <Check className="h-4 w-4" />
            Inserisci Tabella
          </button>
        </div>
      </div>
    </div>
  );
};
