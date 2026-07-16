export type WeatherSection = {
  name: string;
  start: number;
  end: number;
};

export type WeatherLyricLine = {
  start: number;
  end: number;
  numbered: string;
  lyrics: string;
};

type ChordName = keyof typeof CHORD_SHAPES;

const CHORD_SHAPES = {
  Bm7: { frets: '3 2 x x 2 x', notes: '(3.1 2.2 2.5)', root: 'B4' },
  E7: { frets: '0 0 1 0 2 0', notes: '(7.2 6.3 7.4)', root: 'E4' },
  'C#m7': { frets: '4 5 4 6 4 x', notes: '(5.1 4.2 4.5)', root: 'C#5' },
  'F#7': { frets: '2 2 3 2 4 2', notes: '(3.2 2.3 2.4 2.6)', root: 'F#4' },
  'D#m7': { frets: '6 7 6 8 6 x', notes: '(6.1 6.2 6.3 6.5)', root: 'D#5' },
  'D#m6': { frets: '6 5 5 5 x x', notes: '(6.1 5.2 5.3 5.4)', root: 'D#5' },
  'E7b9': { frets: '7 6 7 6 7 0', notes: '(10.1 9.2 10.3 7.4 6.5)', root: 'E4' },
  'F#7b5': { frets: 'x 2 3 2 x 2', notes: '(3.2 2.3 2.6)', root: 'F#4' },
  'G#m7': { frets: '4 4 4 4 6 4', notes: '(4.1 4.2 4.3 4.4 6.5)', root: 'G#4' },
  'F#/A#': { frets: '2 2 3 4 1 x', notes: '(2.1 2.2 3.3 4.4 1.5)', root: 'A#4' },
  Bm11: { frets: '0 0 2 2 2 x', notes: '(0.1 0.2 2.3 2.4 2.5)', root: 'B4' },
  E7sus4: { frets: '0 0 2 0 2 0', notes: '(0.1 0.2 2.3 2.5 0.6)', root: 'E4' },
  'Amaj9/C#': { frets: '4 0 1 2 4 x', notes: '(4.1 0.2 1.3 2.4 4.5)', root: 'C#5' },
  B5: { frets: 'x x 4 4 2 x', notes: '(4.3 4.4 2.5)', root: 'B4' },
  'Dsus2#5': { frets: '5 5 3 0 x x', notes: '(5.1 5.2 3.3 0.4)', root: 'D5' },
  Esus2: { frets: '2 0 4 4 2 0', notes: '(2.1 0.2 4.3 4.4 2.5 0.6)', root: 'E4' },
  'A/C#': { frets: '0 2 2 2 4 x', notes: '(0.1 2.2 2.3 2.4 4.5)', root: 'C#5' },
  'F#': { frets: '2 2 3 4 4 2', notes: '(2.1 2.2 3.3 4.4 4.5 2.6)', root: 'F#4' },
} as const;

export const WEATHER_SECTIONS: WeatherSection[] = [
  { name: '前奏', start: 1, end: 4 },
  { name: '主歌 A', start: 5, end: 20 },
  { name: '副歌 A', start: 21, end: 28 },
  { name: '间奏', start: 29, end: 32 },
  { name: '主歌 B', start: 33, end: 48 },
  { name: '副歌 B', start: 49, end: 56 },
  { name: '桥段', start: 57, end: 65 },
  { name: '副歌 C', start: 66, end: 73 },
  { name: '尾奏', start: 74, end: 81 },
];

export const WEATHER_LYRICS: WeatherLyricLine[] = [
  { start: 1, end: 4, numbered: '—  —  —  —', lyrics: '前奏' },
  { start: 5, end: 8, numbered: '0  23  2332 · 3232  |  23  33  —  |  0333  35335  22', lyrics: '一样在六点泡一样的咖啡，其实早有预谋，在时阴多雨的气候' },
  { start: 9, end: 12, numbered: '0  1321332 · 56  1  |  13  3  —  |  023  77  27  71  2', lyrics: '挤同一班车厢，灵魂却空荡，慢慢调整姿态，故作自然却无力取暖' },
  { start: 13, end: 16, numbered: '0  32 · 0  321  |  35  35  20 · 563  |  0  55630', lyrics: '行李塞满所有不合时宜的月光，只是比方，古人说的浪漫只适合欣赏' },
  { start: 17, end: 20, numbered: '2  22 · 0  671  |  15  5 · 0  541  |  233  0  0', lyrics: '到了站，雨滴同样滴在你肩膀，怪就怪' },
  { start: 21, end: 24, numbered: '3  20 · 3453321  |  3  20 · 0  334  |  333 · 332111', lyrics: '天气像曾哭过的旧电影，那些是非对错留下的痕迹，满街都是未干的记忆' },
  { start: 25, end: 28, numbered: '3  20 · 63453321  |  3  77 · 0  712  |  7  71  27', lyrics: '爱情不过是一场无病呻吟，毫无预警下了又停，怪这场雨不如先怪自己' },
  { start: 29, end: 32, numbered: '—  —  —  —', lyrics: '间奏' },
  { start: 33, end: 36, numbered: '0  23  2332 · 3232  |  23  33  —  |  0333  35335  22', lyrics: '一样在六点说你说的是非，等的人争先恐后，不愿落单还逛街头' },
  { start: 37, end: 40, numbered: '0  1321332 · 56  1  |  13  3  —  |  023  77  27', lyrics: '左顾右盼却找不到方向，慢慢我透过车窗，遥望一片浮云的模样' },
  { start: 41, end: 44, numbered: '0  32 · 0  321  |  35  35  20 · 563  |  0  55630', lyrics: '不想随着霓虹灯烦乱舞，总是怕好景不常，我反复练习不入歌舞步' },
  { start: 45, end: 48, numbered: '2  22 · 0  671  |  15  5 · 0  541  |  233  0  0', lyrics: '伞下站或许有阵风会为我歌唱，怪就怪' },
  { start: 49, end: 52, numbered: '3  20 · 3453321  |  3  20 · 0  334  |  333 · 332111', lyrics: '天气像个孩子不讲道理，不服气地吹散了落叶一地，乱了的头发不想去整理' },
  { start: 53, end: 56, numbered: '3  20 · 63453321  |  3  77 · 0  712  |  7  71  27', lyrics: '爱情为何总来不及放晴，如果可以云淡风轻，怪这阵风不如先怪自己' },
  { start: 57, end: 60, numbered: '0  32543323  |  3  32321 · 2  7  |  0  0  23661  222', lyrics: '不够壮丽的独白，不明事理的期待，不能保存遗憾' },
  { start: 61, end: 65, numbered: '0  32543324  |  4  0445545  |  2  0  01121  |  54  —', lyrics: '在离站的后半拍，徒留多余的感慨，却走得好慢，怪就怪' },
  { start: 66, end: 69, numbered: '3  20 · 3453321  |  3  20 · 0  334  |  333 · 332111', lyrics: '天气像曾哭过的旧电影，那些是非对错留下的痕迹，满街都是未干的记忆' },
  { start: 70, end: 73, numbered: '3  20 · 63453321  |  3  77 · 0  712  |  7  71  27', lyrics: '爱情不过是一场无病呻吟，毫无预警下了又停，怪这场雨不如先怪自己' },
  { start: 74, end: 81, numbered: '—  —  —  —', lyrics: '尾奏' },
];

const progression: ChordName[][] = [
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['C#m7', 'F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['D#m7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['C#m7', 'F#7'],
  ['Bm7'], ['E7'], ['C#m7'], ['F#7'],
  ['Bm7'], ['D#m6'], ['C#m7'], ['F#7'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm11'], ['E7sus4'], ['Amaj9/C#'], ['F#7b5'],
  ['B5'], ['Dsus2#5'], ['C#m7'], ['D#m7'], ['D#m7'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm7'], ['E7b9'], ['C#m7'], ['F#7b5', 'F#7', 'G#m7', 'F#/A#'],
  ['Bm11'], ['Esus2'], ['A/C#'], ['F#'],
  ['Bm11'], ['Esus2'], ['A/C#'], ['F#'],
];

export const WEATHER_BAR_CHORDS = progression.map((bar) => bar.join(' · '));

type BeatAnnotation = {
  numbered: string;
  lyric: string;
};

function beatCountForBar(chords: ChordName[]) {
  return chords.length > 1 ? chords.length : 8;
}

function distributeTokens(tokens: string[], slots: number, separator = '') {
  return Array.from({ length: slots }, (_, index) => {
    const start = Math.floor((index * tokens.length) / slots);
    const end = Math.floor(((index + 1) * tokens.length) / slots);
    return tokens.slice(start, end).join(separator);
  });
}

function buildBarAnnotations(): BeatAnnotation[][] {
  const result = progression.map((bar) =>
    Array.from({ length: beatCountForBar(bar) }, () => ({ numbered: '', lyric: '' })),
  );

  for (const line of WEATHER_LYRICS) {
    const barIndices = Array.from(
      { length: line.end - line.start + 1 },
      (_, index) => line.start - 1 + index,
    );
    const totalSlots = barIndices.reduce(
      (sum, barIndex) => sum + result[barIndex].length,
      0,
    );
    const numbered = distributeTokens(
      line.numbered.match(/[0-7]+|—/g) ?? [],
      totalSlots,
      ' ',
    );
    const lyric = distributeTokens(
      Array.from(line.lyrics.replace(/[，。！？、]/g, '')),
      totalSlots,
    );

    let cursor = 0;
    for (const barIndex of barIndices) {
      for (let beatIndex = 0; beatIndex < result[barIndex].length; beatIndex += 1) {
        result[barIndex][beatIndex] = {
          numbered: numbered[cursor] ?? '',
          lyric: lyric[cursor] ?? '',
        };
        cursor += 1;
      }
    }
  }

  return result;
}

const BAR_ANNOTATIONS = buildBarAnnotations();

function escapeAlphaTexText(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function renderBeatEffects(annotation: BeatAnnotation, chord?: ChordName) {
  const effects: string[] = [];
  if (chord) effects.push(`ch "${chord}"`);
  if (annotation.numbered) {
    effects.push(`lyrics "${escapeAlphaTexText(annotation.numbered)}"`);
  }
  if (annotation.lyric) {
    effects.push(`lyrics 1 "${escapeAlphaTexText(annotation.lyric)}"`);
  }
  return effects.length > 0 ? `{${effects.join(' ')}}` : '';
}

function renderChordDefinitions() {
  return Object.entries(CHORD_SHAPES)
    .map(([name, shape]) => `\\chord ("${name}" ${shape.frets}) {showDiagram true}`)
    .join('\n');
}

function renderGuitarBar(chords: ChordName[], barNumber: number) {
  const section = WEATHER_SECTIONS.find((item) => item.start === barNumber);
  const heading = section ? `// ${section.name}\n` : '';
  const annotations = BAR_ANNOTATIONS[barNumber - 1];

  if (chords.length > 1) {
    const beats = chords
      .map((name, index) =>
        `${CHORD_SHAPES[name].notes}.4${renderBeatEffects(annotations[index], name)}`,
      )
      .join(' ');
    return `${heading}${beats} |`;
  }

  const name = chords[0];
  const notes = CHORD_SHAPES[name].notes;
  const pattern = [
    `${notes}.8`,
    `${notes}.8`,
    'x.1.8',
    `${notes}.8`,
    `${notes}.8`,
    `${notes}.8`,
    'x.1.8',
    `${notes}.8`,
  ];
  const beats = pattern.map((beat, index) =>
    `${beat}${renderBeatEffects(annotations[index], index === 0 ? name : undefined)}`,
  );
  return `${heading}${beats.join(' ')} |`;
}

function renderMelodyBar(chords: ChordName[]) {
  const root = CHORD_SHAPES[chords[0]].root;
  return `:4 ${root} ${root} ${root} ${root} |`;
}

export const WEATHER_TEX = `\\title "怪天气"
\\artist "黄宣"
\\music "周锒的吉他教室编配"
\\tempo 77
\\ts 4 4
.
\\track "钢弦吉他"
\\staff {tabs}
\\tuning (E4 B3 G3 D3 A2 E2) { hide }
${renderChordDefinitions()}
${progression.map((bar, index) => renderGuitarBar(bar, index + 1)).join('\n')}

\\track "数字旋律"
\\tuning piano
${progression.map(renderMelodyBar).join('\n')}`;

export function weatherLineAt(bar: number) {
  return WEATHER_LYRICS.find((line) => bar >= line.start && bar <= line.end) ?? WEATHER_LYRICS[0];
}

export function weatherSectionAt(bar: number) {
  return WEATHER_SECTIONS.find((section) => bar >= section.start && bar <= section.end) ?? WEATHER_SECTIONS[0];
}
