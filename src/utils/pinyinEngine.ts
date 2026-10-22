// Comprehensive Hanzi to Pinyin and Hanja to Hangul dictionary engine
// Supports automatic batch conversion for full paragraphs, sentences, and words.

// Map of common Chinese characters to their standard Pinyin with tone marks
// Covering high-frequency characters, basic vocabulary, Tang/Song poetry, and general texts.
import { PINYIN_DATABASE } from './pinyinData';

export function getCharacterPinyin(char: string): string | null {
  return PINYIN_DATABASE[char] || null;
}

// Korean Hanja to Hangul dictionary
import { HANJA_DATABASE } from './hanjaData';

export function getHanjaHangul(char: string): string | null {
  return HANJA_DATABASE[char] || null;
}

/**
 * Converts a whole Chinese string into Ruby HTML:
 * e.g. "春眠不觉晓" -> "<ruby>春<rt>chūn</rt></ruby><ruby>眠<rt>mián</rt></ruby>..."
 * Non-Chinese characters (punctuation, numbers, English) are preserved as plain text.
 */
export function convertChineseToRubyBatch(text: string): string {
  let result = '';
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    let lineHtml = '';
    const chars = Array.from(line);
    for (const char of chars) {
      // Check if character is CJK Hanzi
      if (/[\u4e00-\u9fa5]/.test(char)) {
        const pinyin = getCharacterPinyin(char);
        if (pinyin) {
          lineHtml += `<ruby>${char}<rt>${pinyin}</rt></ruby>`;
        } else {
          // Hanzi without mapped pinyin: keep ruby with placeholder or just char
          lineHtml += `<ruby>${char}<rt></rt></ruby>`;
        }
      } else if (char === ' ') {
        lineHtml += '&nbsp;';
      } else {
        lineHtml += char;
      }
    }
    result += lineHtml;
    if (lineIdx < lines.length - 1) {
      result += '<br />';
    }
  });

  return result;
}

/**
 * Converts a whole Korean text with Hanja into Ruby HTML:
 * e.g. "學校" -> "<ruby>學<rt>학</rt></ruby><ruby>校<rt>교</rt></ruby>"
 */
export function convertHanjaToRubyBatch(text: string): string {
  let result = '';
  const lines = text.split('\n');

  lines.forEach((line, lineIdx) => {
    let lineHtml = '';
    const chars = Array.from(line);
    for (const char of chars) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        const hangul = getHanjaHangul(char);
        if (hangul) {
          lineHtml += `<ruby>${char}<rt>${hangul}</rt></ruby>`;
        } else {
          lineHtml += char;
        }
      } else if (char === ' ') {
        lineHtml += '&nbsp;';
      } else {
        lineHtml += char;
      }
    }
    result += lineHtml;
    if (lineIdx < lines.length - 1) {
      result += '<br />';
    }
  });

  return result;
}
