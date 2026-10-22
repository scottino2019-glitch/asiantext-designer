// High quality inline SVGs for traditional artwork, seals and stamps
export const ART_PRESETS = [
  {
    id: 'chinese-seal',
    title: 'Sigillo Rosso Tradizionale (印章)',
    description: 'Timbro calligrafico in cinabro vermiglio',
    category: 'seal',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' width='160' height='160'><rect x='8' y='8' width='144' height='144' rx='14' fill='%23c23531' stroke='%23991b1b' stroke-width='4'/><rect x='16' y='16' width='128' height='128' rx='8' fill='none' stroke='%23fef2f2' stroke-width='2' stroke-opacity='0.7'/><text x='50' y='72' font-family='Noto Serif SC, serif' font-size='38' font-weight='bold' fill='%23ffffff' text-anchor='middle'>文</text><text x='110' y='72' font-family='Noto Serif SC, serif' font-size='38' font-weight='bold' fill='%23ffffff' text-anchor='middle'>墨</text><text x='50' y='126' font-family='Noto Serif SC, serif' font-size='38' font-weight='bold' fill='%23ffffff' text-anchor='middle'>清</text><text x='110' y='126' font-family='Noto Serif SC, serif' font-size='38' font-weight='bold' fill='%23ffffff' text-anchor='middle'>雅</text></svg>"
  },
  {
    id: 'korean-seal',
    title: 'Sigillo Coreano Tradizionale (도장)',
    description: 'Sigillo rotondo in cinabro con Hangul calligrafico',
    category: 'seal',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160' width='160' height='160'><circle cx='80' cy='80' r='72' fill='%23c23531' stroke='%23991b1b' stroke-width='4'/><circle cx='80' cy='80' r='64' fill='none' stroke='%23fef2f2' stroke-width='2' stroke-opacity='0.7'/><text x='54' y='72' font-family='Nanum Myeongjo, serif' font-size='36' font-weight='bold' fill='%23ffffff' text-anchor='middle'>한</text><text x='106' y='72' font-family='Nanum Myeongjo, serif' font-size='36' font-weight='bold' fill='%23ffffff' text-anchor='middle'>글</text><text x='54' y='122' font-family='Nanum Myeongjo, serif' font-size='36' font-weight='bold' fill='%23ffffff' text-anchor='middle'>서</text><text x='106' y='122' font-family='Nanum Myeongjo, serif' font-size='36' font-weight='bold' fill='%23ffffff' text-anchor='middle'>예</text></svg>"
  },
  {
    id: 'bamboo-ink',
    title: 'Bambù ad Inchiostro di China (水墨竹)',
    description: "Dipinto tradizionale d'inchiostro su carta di riso",
    category: 'painting',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 380' width='300' height='380'><rect width='100%25' height='100%25' fill='%23faf7ee'/><path d='M140 370 Q138 290 145 220 Q150 160 142 90 Q138 40 140 10' stroke='%231e293b' stroke-width='14' stroke-linecap='round' fill='none'/><path d='M140 370 Q138 290 145 220 Q150 160 142 90 Q138 40 140 10' stroke='%23334155' stroke-width='8' stroke-linecap='round' fill='none'/><line x1='128' y1='222' x2='158' y2='220' stroke='%230f172a' stroke-width='7'/><line x1='126' y1='128' x2='156' y2='126' stroke='%230f172a' stroke-width='6'/><path d='M145 220 Q190 200 240 215 Q190 215 145 220' fill='%231e293b'/><path d='M145 220 Q180 180 230 185 Q175 195 145 220' fill='%23334155'/><path d='M142 128 Q80 110 40 135 Q90 120 142 128' fill='%231e293b'/><path d='M142 128 Q70 90 25 105 Q80 100 142 128' fill='%23334155'/><path d='M140 40 Q200 15 250 35 Q190 35 140 40' fill='%230f172a'/><circle cx='60' cy='320' r='18' fill='%23c23531' fill-opacity='0.85'/></svg>"
  },
  {
    id: 'lotus-watermark',
    title: 'Fiore di Loto Tradizionale (莲花 / 연꽃)',
    description: 'Ideale come filigrana artistica dietro al testo',
    category: 'watermark',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 240' width='320' height='240'><path d='M160 30 C150 90 110 130 90 160 C130 165 155 125 160 30 Z' fill='%23c23531' fill-opacity='0.6'/><path d='M160 30 C170 90 210 130 230 160 C190 165 165 125 160 30 Z' fill='%23c23531' fill-opacity='0.6'/><path d='M160 15 C130 75 130 130 160 170 C190 130 190 75 160 15 Z' fill='%23e11d48' fill-opacity='0.75'/><path d='M95 110 C50 130 40 170 55 190 C95 185 115 150 95 110 Z' fill='%23f43f5e' fill-opacity='0.5'/><path d='M225 110 C270 130 280 170 265 190 C225 185 205 150 225 110 Z' fill='%23f43f5e' fill-opacity='0.5'/><path d='M70 185 Q160 210 250 185 Q160 225 70 185' fill='%23047857' fill-opacity='0.7'/></svg>"
  }
];

export interface DocumentTemplate {
  id: string;
  name: string;
  lang: 'chinese' | 'korean';
  description: string;
  html: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'chinese-study-sheet',
    name: 'Cinese: Scheda Studio con Ruby Pinyin & Griglia',
    lang: 'chinese',
    description: 'Eserciziario con annotazioni Pinyin Ruby, immagine ad inchiostro con testo fluido e tabella vocaboli.',
    html: `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #c23531; padding-bottom: 14px;">
        <h1 style="font-family: 'Ma Shan Zheng', cursive; font-size: 32px; color: #c23531; margin: 0 0 6px 0; letter-spacing: 2px;">
          中文学习工作表 (Foglio di Studio Cinese)
        </h1>
        <p style="font-family: 'Noto Serif SC', serif; font-size: 13px; color: #64748b; margin: 0;">
          Lezione 01 ・ Vocabolario fondamentale e pronuncia con annotazioni Pinyin Ruby
        </p>
      </div>

      <div class="img-wrap-left" contenteditable="false" style="width: 120px; margin-right: 18px; margin-bottom: 10px;">
        <img src="${ART_PRESETS[2].url}" alt="Inchiostro bambù" style="width: 100%; border-radius: 6px; border: 1px solid #e2e8f0; display: block;" />
        <div style="font-size: 11px; text-align: center; color: #64748b; margin-top: 4px;">水墨竹韵</div>
      </div>

      <p style="font-family: 'Noto Serif SC', serif; font-size: 15px; line-height: 1.8; color: #1e293b; margin-bottom: 14px;">
        Benvenuti in questo documento di studio. In lingua cinese, ogni carattere <ruby>汉<rt>hàn</rt></ruby><ruby>字<rt>zì</rt></ruby> possiede un significato semantico e una pronuncia associata. Notate come il testo in questo paragrafo scorre in modo del tutto fluido e naturale attorno all'illustrazione tradizionale posizionata a sinistra!
      </p>

      <p style="font-family: 'Noto Serif SC', serif; font-size: 15px; line-height: 1.8; color: #1e293b; margin-bottom: 18px;">
        Grazie alla notazione <ruby>拼<rt>pīn</rt></ruby><ruby>音<rt>yīn</rt></ruby> (Ruby text), gli studenti possono leggere agevolmente caratteri complessi senza dover consultare un dizionario esterno: ad esempio <ruby>学<rt>xué</rt></ruby><ruby>习<rt>xí</rt></ruby> (studiare), <ruby>朋<rt>péng</rt></ruby><ruby>友<rt>yǒu</rt></ruby> (amico), e <ruby>中<rt>zhōng</rt></ruby><ruby>国<rt>guó</rt></ruby> (Cina).
      </p>

      <div style="clear: both;"></div>

      <h2 style="font-family: 'Ma Shan Zheng', cursive; font-size: 20px; color: #1e293b; border-left: 4px solid #c23531; padding-left: 10px; margin: 20px 0 10px 0;">
        一、 常用词汇表 (Tabella Vocabolario Frequente)
      </h2>

      <div class="table-container" style="width: 100%; max-width: 100%; margin-bottom: 20px;">
        <table class="doc-table" style="width: 100% !important; max-width: 100% !important; table-layout: fixed !important; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 7px 10px; text-align: left; width: 28%; font-family: 'Noto Serif SC', serif; color: #c23531;">Carattere & Ruby</th>
              <th style="padding: 7px 10px; text-align: left; width: 24%;">Pinyin</th>
              <th style="padding: 7px 10px; text-align: left; width: 32%;">Significato</th>
              <th style="padding: 7px 10px; text-align: center; width: 16%;">Livello</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>你<rt>nǐ</rt></ruby><ruby>好<rt>hǎo</rt></ruby></td>
              <td style="padding: 7px 10px;">nǐ hǎo</td>
              <td style="padding: 7px 10px;">Ciao / Salve</td>
              <td style="padding: 7px 10px; text-align: center;"><span style="background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 9999px; font-size: 11px;">HSK 1</span></td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>谢<rt>xiè</rt></ruby><ruby>谢<rt>xie</rt></ruby></td>
              <td style="padding: 7px 10px;">xiè xie</td>
              <td style="padding: 7px 10px;">Grazie</td>
              <td style="padding: 7px 10px; text-align: center;"><span style="background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 9999px; font-size: 11px;">HSK 1</span></td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>再<rt>zài</rt></ruby><ruby>见<rt>jiàn</rt></ruby></td>
              <td style="padding: 7px 10px;">zài jiàn</td>
              <td style="padding: 7px 10px;">Arrivederci</td>
              <td style="padding: 7px 10px; text-align: center;"><span style="background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 9999px; font-size: 11px;">HSK 1</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="font-family: 'Ma Shan Zheng', cursive; font-size: 20px; color: #1e293b; border-left: 4px solid #c23531; padding-left: 10px; margin: 20px 0 10px 0;">
        二、 学习要点 (Punti Chiave)
      </h2>

      <div style="font-family: 'Noto Serif SC', serif; font-size: 14px; line-height: 1.8; color: #334155;">
        <p style="margin: 4px 0;">① I quattro toni del mandarino (ā, á, ǎ, à) determinano il significato semantico di ogni sillaba.</p>
        <p style="margin: 4px 0;">② L'ordine dei tratti (笔顺 - bǐshùn) favorisce la regolarità calligrafica del carattere.</p>
        <p style="margin: 4px 0;">③ I radicali (部首 - bùshǒu) offrono indizi visivi sul campo semantico di appartenenza.</p>
      </div>
    `
  },
  {
    id: 'chinese-calligraphy-poem',
    name: 'Cinese: Poesia Classica con Corsivo Calligrafico & Sigillo',
    lang: 'chinese',
    description: 'Documento artistico con font corsivo elegante, versi poetici centrati e sigillo vermiglio.',
    html: `
      <div style="padding: 10px 0 20px 0;">
        <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px;">
          <h1 style="font-family: 'Liu Jian Mao Cao', cursive; font-size: 44px; color: #1e293b; margin: 0 0 6px 0; letter-spacing: 2px;">
            春晓 (Risveglio di Primavera)
          </h1>
          <p style="font-family: 'ZCOOL XiaoWei', serif; font-size: 16px; color: #64748b; letter-spacing: 3px; margin: 0;">
            唐 ・ 孟浩然 (Meng Haoran, Dinastia Tang)
          </p>
        </div>

        <div style="text-align: center; font-family: 'Ma Shan Zheng', cursive; font-size: 26px; line-height: 2.2; color: #1e293b; letter-spacing: 4px; margin: 28px 0;">
          <div style="margin: 6px 0;"><ruby>春<rt>chūn</rt></ruby><ruby>眠<rt>mián</rt></ruby><ruby>不<rt>bù</rt></ruby><ruby>觉<rt>jué</rt></ruby><ruby>晓<rt>xiǎo</rt></ruby>，</div>
          <div style="margin: 6px 0;"><ruby>处<rt>chù</rt></ruby><ruby>处<rt>chù</rt></ruby><ruby>闻<rt>wén</rt></ruby><ruby>啼<rt>tí</rt></ruby><ruby>鸟<rt>niǎo</rt></ruby>。</div>
          <div style="margin: 6px 0;"><ruby>夜<rt>yè</rt></ruby><ruby>来<rt>lái</rt></ruby><ruby>风<rt>fēng</rt></ruby><ruby>雨<rt>yǔ</rt></ruby><ruby>声<rt>shēng</rt></ruby>，</div>
          <div style="margin: 6px 0;"><ruby>花<rt>huā</rt></ruby><ruby>落<rt>luò</rt></ruby><ruby>知<rt>zhī</rt></ruby><ruby>多<rt>duō</rt></ruby><ruby>少<rt>shǎo</rt></ruby>。</div>
        </div>

        <div style="text-align: right; margin-right: 30px; margin-bottom: 24px;">
          <img src="${ART_PRESETS[0].url}" alt="Sigillo Rosso" style="width: 72px; height: 72px; display: inline-block; vertical-align: middle;" />
          <span style="font-family: 'ZCOOL XiaoWei', serif; font-size: 13px; color: #94a3b8; margin-left: 8px;">文墨清雅</span>
        </div>

        <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px 20px; font-family: 'Noto Serif SC', serif; font-size: 14px; color: #475569; line-height: 1.8;">
          <strong style="color: #c23531; display: block; margin-bottom: 4px;">Traduzione poetica italiana:</strong>
          <em>Nel sonno primaverile non mi sono accorto dell'alba,<br />
          dappertutto odo il cinguettio degli uccelli.<br />
          Nella notte è giunto il rumore del vento e della pioggia,<br />
          chissà quanti fiori saranno caduti!</em>
        </div>
      </div>
    `
  },
  {
    id: 'korean-study-guide',
    name: 'Coreano: Guida di Studio con Hanja, Hangul & Tabelle',
    lang: 'korean',
    description: 'Foglio accademico coreano con font Myeongjo, sigillo vermiglio e tabella bilingue Hanja/Hangul.',
    html: `
      <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; border: none; margin: 0;">
          <tbody>
            <tr>
              <td style="border: none; padding: 0; vertical-align: bottom;">
                <h1 style="font-family: 'Nanum Brush Script', cursive; font-size: 34px; color: #1e3a8a; margin: 0; line-height: 1.1;">
                  한국어 고급 학습 가이드 (Guida Avanzata di Coreano)
                </h1>
                <p style="font-family: 'Nanum Myeongjo', serif; font-size: 13px; color: #64748b; margin: 4px 0 0 0;">
                  Corrispondenza tra caratteri Hanja (漢字) e pronuncia Hangul (한글)
                </p>
              </td>
              <td style="border: none; padding: 0; text-align: right; width: 68px; vertical-align: bottom;">
                <img src="${ART_PRESETS[1].url}" alt="Sigillo Coreano" style="width: 64px; height: 64px; display: inline-block;" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style="font-family: 'Nanum Myeongjo', serif; font-size: 15px; line-height: 1.8; color: #1e293b; margin-bottom: 14px;">
        La lingua coreana combina l'alfabeto fonetico Hangul con radici lessicali sinocoreane (Hanja). Con la funzionalità Ruby possiamo specificare la lettura fonetica Hangul direttamente sopra i caratteri Hanja: ad esempio <ruby>學<rt>학</rt></ruby><ruby>校<rt>교</rt></ruby> (scuola), <ruby>先<rt>선</rt></ruby><ruby>生<rt>생</rt></ruby> (insegnante), e <ruby>韓<rt>한</rt></ruby><ruby>國<rt>국</rt></ruby> (Corea).
      </p>

      <h2 style="font-family: 'Noto Serif KR', serif; font-size: 18px; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin: 20px 0 10px 0;">
        가. 주요 한자어 목록 (Lista Vocaboli Hanja Fondamentali)
      </h2>

      <div class="table-container" style="width: 100%; max-width: 100%; margin-bottom: 20px;">
        <table class="doc-table" style="width: 100% !important; max-width: 100% !important; table-layout: fixed !important; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #eff6ff; border-bottom: 2px solid #93c5fd;">
              <th style="padding: 7px 10px; text-align: left; width: 33%; color: #1e3a8a; font-family: 'Noto Serif KR', serif;">Hanja & Ruby</th>
              <th style="padding: 7px 10px; text-align: left; width: 33%;">Hangul Corrispondente</th>
              <th style="padding: 7px 10px; text-align: left; width: 34%;">Significato Italiano</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>時<rt>시</rt></ruby><ruby>間<rt>간</rt></ruby></td>
              <td style="padding: 7px 10px; font-weight: 600;">시간 (Sigan)</td>
              <td style="padding: 7px 10px;">Tempo / Ore</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>家<rt>가</rt></ruby><ruby>族<rt>족</rt></ruby></td>
              <td style="padding: 7px 10px; font-weight: 600;">가족 (Gajok)</td>
              <td style="padding: 7px 10px;">Famiglia</td>
            </tr>
            <tr>
              <td style="padding: 7px 10px; font-size: 16px;"><ruby>發<rt>발</rt></ruby><ruby>展<rt>전</rt></ruby></td>
              <td style="padding: 7px 10px; font-weight: 600;">발전 (Baljeon)</td>
              <td style="padding: 7px 10px;">Sviluppo / Progresso</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="font-family: 'Noto Serif KR', serif; font-size: 18px; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin: 20px 0 10px 0;">
        나. 학습 단계별 안내 (Fasi di Studio con Numerazione Coreana)
      </h2>

      <div style="font-family: 'Nanum Myeongjo', serif; font-size: 14px; line-height: 1.8; color: #334155;">
        <p style="margin: 4px 0;">㉮ 1단계: Riconoscimento del radicale e del significato primario del carattere.</p>
        <p style="margin: 4px 0;">㉯ 2단계: Esercitazione sulla pronuncia autentica Hangul con lettura a voce alta.</p>
        <p style="margin: 4px 0;">㉰ 3단계: Composizione di frasi bilingui con l'ausilio delle tabelle riassuntive.</p>
      </div>
    `
  },
  {
    id: 'blank-doc',
    name: 'Foglio Vuoto (Nuovo Documento)',
    lang: 'chinese',
    description: 'Documento pulito pronto per la scrittura libera.',
    html: `
      <h1 style="font-family: 'Noto Serif SC', serif; font-size: 26px; color: #1e293b; margin-bottom: 12px;">
        Nuovo Documento CJK
      </h1>
      <p style="font-family: 'Noto Serif SC', serif; font-size: 15px; line-height: 1.8; color: #334155;">
        Inizia a digitare qui il tuo testo in cinese o coreano. Puoi aggiungere annotazioni Ruby, inserire immagini con testo che scorre fluido a destra o sinistra, applicare font corsivi o stampatello e creare tabelle personalizzate.
      </p>
    `
  }
];
