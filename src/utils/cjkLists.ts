export interface CjkListType {
  id: string;
  label: string;
  category: 'chinese' | 'korean' | 'standard';
  example: string;
  items: string[];
}

export const CJK_LIST_TYPES: CjkListType[] = [
  // Cinese
  {
    id: 'cn-numerals',
    label: 'Cinese - Cifre tradizionali (一、二、三、)',
    category: 'chinese',
    example: '一、 Prima voce\n二、 Seconda voce\n三、 Terza voce',
    items: ['一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、']
  },
  {
    id: 'cn-circled',
    label: 'Cinese/Orientale - Cerchiati (① ② ③)',
    category: 'chinese',
    example: '① Introduzione\n② Sviluppo\n③ Conclusione',
    items: ['① ', '② ', '③ ', '④ ', '⑤ ', '⑥ ', '⑦ ', '⑧ ', '⑨ ', '⑩ ']
  },
  {
    id: 'cn-parentheses',
    label: 'Cinese - Tra parentesi (㈠ ㈡ ㈢)',
    category: 'chinese',
    example: '㈠ Capitolo 1\n㈡ Capitolo 2\n㈢ Capitolo 3',
    items: ['㈠ ', '㈡ ', '㈢ ', '㈣ ', '㈤ ', '㈥ ', '㈦ ', '㈧ ', '㈨ ', '㈩ ']
  },
  {
    id: 'cn-stems',
    label: 'Cinese - Tronchi celesti (甲、乙、丙、丁)',
    category: 'chinese',
    example: '甲、 Requisito A\n乙、 Requisito B\n丙、 Requisito C',
    items: ['甲、', '乙、', '丙、', '丁、', '戊、', '己、', '庚、', '辛、', '壬、', '癸、']
  },
  {
    id: 'cn-financial',
    label: 'Cinese - Finanziario solenne (壹、贰、叁)',
    category: 'chinese',
    example: '壹、 Clausola prima\n贰、 Clausola seconda\n叁、 Clausola terza',
    items: ['壹、', '贰、', '叁、', '肆、', '伍、', '陆、', '柒、', '捌、', '玖、', '拾、']
  },

  // Coreano
  {
    id: 'kr-syllables',
    label: 'Coreano - Sillabico Ga-Na-Da (가. 나. 다. 라.)',
    category: 'korean',
    example: '가. 첫 번째 항목 (Primo punto)\n나. 두 번째 항목 (Secondo punto)\n다. 세 번째 항목 (Terzo punto)',
    items: ['가. ', '나. ', '다. ', '라. ', '마. ', '바. ', '사. ', '아. ', '자. ', '차. ']
  },
  {
    id: 'kr-consonants',
    label: 'Coreano - Consonanti (ㄱ. ㄴ. ㄷ. ㄹ.)',
    category: 'korean',
    example: 'ㄱ. 기본 요소\nㄴ. 세부 내용\nㄷ. 주의 사항',
    items: ['ㄱ. ', 'ㄴ. ', 'ㄷ. ', 'ㄹ. ', 'ㅁ. ', 'ㅂ. ', 'ㅅ. ', 'ㅇ. ', 'ㅈ. ', 'ㅊ. ']
  },
  {
    id: 'kr-circled-syllables',
    label: 'Coreano - Sillabico cerchiato (㉮ ㉯ ㉰ ㉱)',
    category: 'korean',
    example: '㉮ 필수 사항\n㉯ 선택 사항\n㉰ 참고 내용',
    items: ['㉮ ', '㉯ ', '㉰ ', '㉱ ', '㉲ ', '㉳ ', '㉴ ', '㉵ ', '㉶ ', '㉷ ']
  },
  {
    id: 'kr-paren-syllables',
    label: 'Coreano - Sillabico con parentesi ((가) (나) (다))',
    category: 'korean',
    example: '(가) 학습 목표\n(나) 교재 안내\n(다) 과제 제출',
    items: ['(가) ', '(나) ', '(다) ', '(라) ', '(마) ', '(바) ', '(사) ', '(아) ', '(자) ', '(차) ']
  },
  {
    id: 'kr-circled-consonants',
    label: 'Coreano - Consonanti cerchiate (㉠ ㉡ ㉢ ㉣)',
    category: 'korean',
    example: '㉠ 문법 규칙\n㉡ 발음 연습\n㉢ 쓰기 과제',
    items: ['㉠ ', '㉡ ', '㉢ ', '㉣ ', '㉤ ', '㉥ ', '㉦ ', '㉧ ', '㉨ ', '㉩ ']
  },
  {
    id: 'kr-steps',
    label: 'Coreano - Fasi di lavoro (1단계, 2단계...)',
    category: 'korean',
    example: '1단계: 준비\n2단계: 실행\n3단계: 완료',
    items: ['1단계: ', '2단계: ', '3단계: ', '4단계: ', '5단계: ']
  },

  // Simboli decorativi orientali
  {
    id: 'cjk-dots',
    label: 'Puntati Orientali (・, ◆, ▪, ✦)',
    category: 'standard',
    example: '・ Punto primo\n・ Punto secondo\n・ Punto terzo',
    items: ['・ ', '・ ', '・ ', '・ ', '・ ', '・ ']
  },
  {
    id: 'cjk-diamonds',
    label: 'Rombi Orientali (◆ ◆ ◆)',
    category: 'standard',
    example: '◆ Caratteristica A\n◆ Caratteristica B\n◆ Caratteristica C',
    items: ['◆ ', '◆ ', '◆ ', '◆ ', '◆ ', '◆ ']
  }
];

export const PINYIN_TONES_MAP: { base: string; tones: string[] }[] = [
  { base: 'a', tones: ['ā', 'á', 'ǎ', 'à'] },
  { base: 'e', tones: ['ē', 'é', 'ě', 'è'] },
  { base: 'i', tones: ['ī', 'í', 'ǐ', 'ì'] },
  { base: 'o', tones: ['ō', 'ó', 'ǒ', 'ò'] },
  { base: 'u', tones: ['ū', 'ú', 'ǔ', 'ù'] },
  { base: 'ü', tones: ['ǖ', 'ǘ', 'ǚ', 'ǜ'] },
];

export const COMMON_RUBY_PRESETS = [
  // Cinese
  { lang: 'zh', text: '你好', ruby: 'nǐ hǎo', meaning: 'Ciao / Buongiorno' },
  { lang: 'zh', text: '谢谢', ruby: 'xiè xie', meaning: 'Grazie' },
  { lang: 'zh', text: '中文', ruby: 'zhōng wén', meaning: 'Lingua cinese' },
  { lang: 'zh', text: '学习', ruby: 'xué xí', meaning: 'Studiare' },
  { lang: 'zh', text: '朋友', ruby: 'péng you', meaning: 'Amico' },
  { lang: 'zh', text: '中国', ruby: 'zhōng guó', meaning: 'Cina' },
  { lang: 'zh', text: '水', ruby: 'shuǐ', meaning: 'Acqua' },
  { lang: 'zh', text: '山', ruby: 'shān', meaning: 'Montagna' },
  { lang: 'zh', text: '天地', ruby: 'tiān dì', meaning: 'Cielo e terra' },
  // Coreano (Hanja -> Hangul)
  { lang: 'ko', text: '學校', ruby: '학교', meaning: 'Scuola (School)' },
  { lang: 'ko', text: '先生', ruby: '선생', meaning: 'Insegnante / Maestro' },
  { lang: 'ko', text: '學生', ruby: '학생', meaning: 'Studente' },
  { lang: 'ko', text: '韓國', ruby: '한국', meaning: 'Corea' },
  { lang: 'ko', text: '父母', ruby: '부모', meaning: 'Genitori' },
  { lang: 'ko', text: '時間', ruby: '시간', meaning: 'Tempo / Ora' },
  { lang: 'ko', text: '家族', ruby: '가족', meaning: 'Famiglia' },
  { lang: 'ko', text: '漢字', ruby: '한자', meaning: 'Caratteri cinesi (Hanja)' },
];
