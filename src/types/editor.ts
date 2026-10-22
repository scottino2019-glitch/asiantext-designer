export type LanguageMode = 'all' | 'chinese' | 'korean';

export type FontOption = {
  id: string;
  name: string;
  nativeName: string;
  family: string;
  category: 'chinese-print' | 'chinese-cursive' | 'korean-print' | 'korean-cursive' | 'standard';
  description: string;
};

export const CJK_FONTS: FontOption[] = [
  // Cinese - Stampatello
  {
    id: 'noto-serif-sc',
    name: 'Noto Serif SC',
    nativeName: '宋体 / 明体 (SongTi)',
    family: "'Noto Serif SC', serif",
    category: 'chinese-print',
    description: 'Stampatello classico elegante con grazie, ideale per libri e articoli ufficiali'
  },
  {
    id: 'noto-sans-sc',
    name: 'Noto Sans SC',
    nativeName: '黑体 (HeiTi)',
    family: "'Noto Sans SC', sans-serif",
    category: 'chinese-print',
    description: 'Stampatello moderno e lineare senza grazie, massima leggibilità a schermo e stampa'
  },
  // Cinese - Corsivo & Calligrafico
  {
    id: 'ma-shan-zheng',
    name: 'Ma Shan Zheng',
    nativeName: '马善政楷书 (XingKai)',
    family: "'Ma Shan Zheng', cursive",
    category: 'chinese-cursive',
    description: 'Corsivo calligrafico a pennello vigoroso e dinamico'
  },
  {
    id: 'liu-jian-mao-cao',
    name: 'Liu Jian Mao Cao',
    nativeName: '刘建毛草 (Wild Cursive / 草书)',
    family: "'Liu Jian Mao Cao', cursive",
    category: 'chinese-cursive',
    description: 'Corsivo erba espressivo, perfetto per poesie e pergamene artistiche'
  },
  {
    id: 'long-cang',
    name: 'Long Cang',
    nativeName: '龙苍行书 (XingShu)',
    family: "'Long Cang', cursive",
    category: 'chinese-cursive',
    description: 'Corsivo fluido semi-formale, stile calligrafico moderno'
  },
  {
    id: 'zcool-xiaowei',
    name: 'ZCOOL XiaoWei',
    nativeName: '站酷小薇体 (XiaoWei)',
    family: "'ZCOOL XiaoWei', serif, cursive",
    category: 'chinese-cursive',
    description: 'Calligrafico raffinato con tratti aggraziati e poetici'
  },
  // Coreano - Stampatello
  {
    id: 'nanum-myeongjo',
    name: 'Nanum Myeongjo',
    nativeName: '나눔명조 (Myeongjo)',
    family: "'Nanum Myeongjo', serif",
    category: 'korean-print',
    description: 'Stampatello coreano tradizionale con grazie (Batang), prestigioso ed editoriale'
  },
  {
    id: 'noto-serif-kr',
    name: 'Noto Serif KR',
    nativeName: '본명조 (Noto Myeongjo)',
    family: "'Noto Serif KR', serif",
    category: 'korean-print',
    description: 'Serif coreano contemporaneo di alta precisione tipografica'
  },
  {
    id: 'nanum-gothic',
    name: 'Nanum Gothic',
    nativeName: '나눔고딕 (Gothic)',
    family: "'Nanum Gothic', sans-serif",
    category: 'korean-print',
    description: 'Stampatello pulito senza grazie per testi moderni e commerciali'
  },
  {
    id: 'noto-sans-kr',
    name: 'Noto Sans KR',
    nativeName: '본고딕 (Noto Sans KR)',
    family: "'Noto Sans KR', sans-serif",
    category: 'korean-print',
    description: 'Massima chiarezza visiva sia per Hangul che per Hanja'
  },
  // Coreano - Corsivo & Calligrafico
  {
    id: 'nanum-brush',
    name: 'Nanum Brush Script',
    nativeName: '나눔 붓글씨 (Brush Calligraphy)',
    family: "'Nanum Brush Script', cursive",
    category: 'korean-cursive',
    description: 'Corsivo a pennello tradizionale con variazioni di pressione autentiche'
  },
  {
    id: 'nanum-pen',
    name: 'Nanum Pen Script',
    nativeName: '나눔 손글씨 펜 (Pen Script)',
    family: "'Nanum Pen Script', cursive",
    category: 'korean-cursive',
    description: 'Corsivo a penna naturale e personale, caldo e informale'
  },
  // Standard Western
  {
    id: 'sans-system',
    name: 'Inter / Sans-Serif',
    nativeName: 'Standard Sans',
    family: "system-ui, -apple-system, sans-serif",
    category: 'standard',
    description: 'Carattere di sistema neutro'
  },
  {
    id: 'serif-georgia',
    name: 'Georgia / Serif',
    nativeName: 'Standard Serif',
    family: "Georgia, serif",
    category: 'standard',
    description: 'Carattere classico occidentale'
  }
];

export interface ColorPreset {
  name: string;
  hex: string;
  cjkName: string;
}

export const CJK_COLOR_PRESETS: ColorPreset[] = [
  { name: 'Nero Inchiostro di China', hex: '#1e293b', cjkName: '墨黑 (Mò hēi / 먹빛)' },
  { name: 'Rosso Cinabro / Sigillo', hex: '#c23531', cjkName: '朱砂红 (Zhūshā / 주사)' },
  { name: 'Rosso Imperiale', hex: '#b91c1c', cjkName: '故宫红 (Gùgōng hóng)' },
  { name: 'Verde Giada Orientale', hex: '#047857', cjkName: '玉石绿 (Yùshí lǜ / 옥빛)' },
  { name: 'Verde Bambù', hex: '#15803d', cjkName: '竹青 (Zhú qīng)' },
  { name: 'Blu Porcellana Ming', hex: '#1d4ed8', cjkName: '青花瓷蓝 (Qīnghuā lán)' },
  { name: 'Blu Notte Indaco', hex: '#1e1b4b', cjkName: '靛蓝 (Diàn lán / 쪽빛)' },
  { name: 'Oro Imperiale / Ocra', hex: '#b45309', cjkName: '琉璃金 (Liúlí jīn / 금빛)' },
  { name: 'Viola Prugna Cinese', hex: '#7e22ce', cjkName: '紫气东来 (Zǐ qì)' },
  { name: 'Grigio Fumo di Tempio', hex: '#475569', cjkName: '青灰色 (Qīng huī)' },
  { name: 'Rosso Lacca Scuro', hex: '#881337', cjkName: '胭脂红 (Yānzhi / 연지)' },
  { name: 'Bianco Perla Carta', hex: '#f8fafc', cjkName: '宣纸白 (Xuānzhǐ bái)' },
];

export interface ImageInsertOptions {
  url: string;
  position: 'left' | 'right' | 'center' | 'behind';
  widthPercent: number;
  opacity: number;
  caption?: string;
  borderStyle: 'none' | 'thin' | 'double' | 'seal';
  rounded: boolean;
}

export interface DocumentPageSettings {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  margin: 'narrow' | 'normal' | 'wide';
  zoom: number; // 50 to 150%
  writingMode: 'horizontal-tb' | 'vertical-rl';
  title: string;
  showPageNumbers: boolean;
  headerText: string;
}
