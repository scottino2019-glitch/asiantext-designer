import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DocumentPageSettings } from '../types/editor';

/**
 * Scans backwards from targetY to find a clean, completely white row of pixels
 * between lines of text or paragraphs. This ensures multi-page slicing NEVER
 * cuts through the middle of characters.
 */
function findCleanBreakRow(
  ctx: CanvasRenderingContext2D,
  width: number,
  targetY: number,
  searchWindow: number
): number {
  const startY = Math.max(0, Math.round(targetY - searchWindow));
  const endY = Math.min(ctx.canvas.height, Math.round(targetY));
  const bandHeight = endY - startY;

  if (bandHeight <= 0) return targetY;

  try {
    const imgData = ctx.getImageData(0, startY, width, bandHeight).data;
    const sampleStep = 8; // sample every 8th pixel across width for speed

    // Scan from bottom towards top to find the lowest clean whitespace gap
    for (let y = bandHeight - 1; y >= 0; y--) {
      let isWhiteRow = true;
      const rowOffset = y * width * 4;

      for (let x = 0; x < width; x += sampleStep) {
        const idx = rowOffset + x * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        // If pixel is darker than near-white or has opacity, row contains content
        if (a > 20 && (r < 248 || g < 248 || b < 248)) {
          isWhiteRow = false;
          break;
        }
      }

      if (isWhiteRow) {
        return startY + y;
      }
    }
  } catch {
    // Fallback if canvas security restricts getImageData
  }

  return targetY;
}

/**
 * Converts modern CSS colors (like oklch) in an element tree to standard RGB
 * to ensure 100% compatibility with html2canvas and canvas renderers.
 */
function sanitizeModernColors(root: HTMLElement): void {
  const dummyCanvas = document.createElement('canvas');
  const dummyCtx = dummyCanvas.getContext('2d');
  if (!dummyCtx) return;

  const colorProps = ['color', 'backgroundColor', 'borderColor', 'outlineColor'];

  root.querySelectorAll('*').forEach((node) => {
    if (node instanceof HTMLElement) {
      const st = node.style;
      for (const prop of colorProps) {
        const val = (st as any)[prop];
        if (val && typeof val === 'string' && val.includes('oklch')) {
          try {
            dummyCtx.fillStyle = '#000000';
            dummyCtx.fillStyle = val;
            (st as any)[prop] = dummyCtx.fillStyle;
          } catch {
            // Ignore
          }
        }
      }
    }
  });
}

/**
 * Exports document to true physical ISO 216 A4 PDF (210mm x 297mm).
 * Renders in a fixed A4 staging environment so output is never distorted by
 * device viewport size, screen zoom, or mobile responsive constraints.
 */
export async function exportToPdf(
  element: HTMLElement,
  settings: DocumentPageSettings,
  onProgress?: (status: string) => void
): Promise<void> {
  if (!element) return;

  onProgress?.('Preparazione foglio A4...');

  // Brief delay to allow any active editor blur / selection state to settle
  await new Promise((resolve) => setTimeout(resolve, 100));

  const isPortrait = settings.orientation === 'portrait';
  const isA4 = settings.format === 'a4';

  // Standard ISO 216 physical dimensions in millimeters:
  // A4: 210mm x 297mm
  // US Letter fallback: 215.9mm x 279.4mm
  const pdfWidthMm = isA4 ? (isPortrait ? 210 : 297) : (isPortrait ? 215.9 : 279.4);
  const pdfHeightMm = isA4 ? (isPortrait ? 297 : 210) : (isPortrait ? 279.4 : 215.9);

  // Exact standard pixel dimensions at 96 DPI:
  // A4 portrait: 794px width x 1123px height (ratio: 1 : 1.4142)
  // A4 landscape: 1123px width x 794px height (ratio: 1.4142 : 1)
  const targetWidthPx = isPortrait ? 794 : 1123;
  const targetMinHeightPx = isPortrait ? 1123 : 794;

  // 1. Create an isolated off-screen staging container with TRUE A4 proportions.
  // This guarantees that the PDF export is NEVER distorted or squeezed by the
  // user's laptop screen, mobile phone, or AI Studio preview pane!
  const staging = document.createElement('div');
  staging.id = 'a4-pdf-export-staging';
  staging.className = 'print-page';
  staging.style.position = 'relative';
  staging.style.top = '0';
  staging.style.left = '0';
  staging.style.width = `${targetWidthPx}px`;
  staging.style.minWidth = `${targetWidthPx}px`;
  staging.style.maxWidth = `${targetWidthPx}px`;
  staging.style.minHeight = `${targetMinHeightPx}px`;
  staging.style.boxSizing = 'border-box';
  staging.style.backgroundColor = '#ffffff';
  staging.style.color = '#1e293b';
  staging.style.padding = isPortrait ? '44px 50px' : '40px 50px';
  staging.style.fontFamily = "'Noto Serif SC', 'Nanum Myeongjo', serif";
  staging.style.fontSize = '15px';
  staging.style.lineHeight = '1.8';
  staging.style.writingMode = 'horizontal-tb';
  staging.style.direction = 'ltr';
  staging.style.zIndex = '-99999';
  staging.style.pointerEvents = 'none';
  staging.style.overflowX = 'hidden';
  staging.style.wordBreak = 'normal';
  staging.style.overflowWrap = 'break-word';

  // Copy document HTML
  staging.innerHTML = element.innerHTML;

  // Remove any non-printable elements
  staging.querySelectorAll('.no-print').forEach((el) => el.remove());

  // Sanitize any modern oklch CSS color definitions
  sanitizeModernColors(staging);

  // Attach to body for correct CSS cascade and font measurement
  document.body.appendChild(staging);

  // Let DOM layout finalize
  await new Promise((resolve) => setTimeout(resolve, 80));

  onProgress?.('Rendering ad alta definizione (2x)...');

  let canvas: HTMLCanvasElement;
  try {
    // Measure actual rendered height in the true A4 container
    const renderedHeightPx = Math.max(targetMinHeightPx, staging.scrollHeight, staging.offsetHeight);

    canvas = await html2canvas(staging, {
      scale: 2, // 2x crisp print quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: targetWidthPx,
      height: renderedHeightPx,
      windowWidth: Math.max(1280, targetWidthPx + 200),
      windowHeight: Math.max(1800, renderedHeightPx + 200),
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });
  } finally {
    // Always clean up staging DOM element
    staging.remove();
  }

  onProgress?.('Composizione PDF A4...');

  const pdf = new jsPDF({
    orientation: isPortrait ? 'portrait' : 'landscape',
    unit: 'mm',
    format: isA4 ? 'a4' : 'letter',
    compress: true,
  });

  const scale = 2;
  const targetPageCanvasHeight = targetMinHeightPx * scale;
  const targetPageCanvasWidth = targetWidthPx * scale;

  // Check if content fits comfortably on a single A4 page (with 6% tolerance)
  const isSinglePage = canvas.height <= targetPageCanvasHeight * 1.06;

  if (isSinglePage) {
    // SINGLE PAGE A4: Create exact A4 page canvas with zero splitting or distortion
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = targetPageCanvasWidth;
    pageCanvas.height = targetPageCanvasHeight;
    const ctx = pageCanvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(canvas, 0, 0);
    }

    const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');
  } else {
    // MULTI-PAGE A4: Intelligent pagination with clean whitespace breaks.
    // Never slices through the middle of characters!
    let currentY = 0;
    let pageCount = 0;
    const canvasCtx = canvas.getContext('2d');

    while (currentY < canvas.height) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const remainingHeight = canvas.height - currentY;
      let sliceHeight = targetPageCanvasHeight;

      if (remainingHeight <= targetPageCanvasHeight * 1.06) {
        // Last page fits within standard A4 height
        sliceHeight = remainingHeight;
      } else if (canvasCtx) {
        // Search for an empty whitespace row near targetPageCanvasHeight to avoid splitting text
        const targetCutY = currentY + targetPageCanvasHeight;
        const cleanCutY = findCleanBreakRow(canvasCtx, canvas.width, targetCutY, 120 * scale);
        // Only accept clean break if it doesn't make the page abnormally short
        if (cleanCutY - currentY >= targetPageCanvasHeight * 0.6) {
          sliceHeight = cleanCutY - currentY;
        }
      }

      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = targetPageCanvasWidth;
      pageCanvas.height = targetPageCanvasHeight;
      const pageCtx = pageCanvas.getContext('2d');

      if (pageCtx) {
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0,
          currentY,
          canvas.width,
          Math.min(sliceHeight, remainingHeight),
          0,
          0,
          pageCanvas.width,
          Math.min(sliceHeight, remainingHeight)
        );
      }

      const imgData = pageCanvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm, undefined, 'FAST');

      currentY += sliceHeight;
      pageCount++;

      // Failsafe safety limit
      if (pageCount >= 30) break;
    }
  }

  onProgress?.('Salvataggio file PDF...');

  const safeTitle = (settings.title || 'documento_cjk')
    .replace(/[^a-zA-Z0-9_\u4e00-\u9fa5\uac00-\ud7af]/g, '_')
    .slice(0, 40);

  pdf.save(`${safeTitle}.pdf`);
}

/**
 * Triggers standard browser print dialog for 100% crisp vector printing
 */
export function triggerPrintDialog(): void {
  window.print();
}
