export interface SampleScore {
  name: string;
  description: string;
  tex: string;
}

/**
 * Built-in ORIGINAL demo scores written in alphaTex. These are simple, generic
 * practice etudes composed for this app — not transcriptions of any existing or
 * copyrighted song. They exist purely to demonstrate rendering and playback.
 */
export const SAMPLE_SCORES: SampleScore[] = [
  {
    name: 'C 大调音阶练习',
    description: '单音阶上行 / 下行，适合测试光标与节拍器',
    tex: `\\title "C 大调音阶练习"
\\subtitle "GuitarTab Studio 示例"
\\tempo 90
.
\\track "Guitar"
\\clef G2
0.6.4 2.6.4 3.6.4 0.5.4 |
2.5.4 3.5.4 0.4.4 2.4.4 |
0.3.4 2.3.4 0.2.4 1.2.4 |
0.1.4 1.1.4 3.1.2 |
3.1.4 1.1.4 0.1.4 1.2.4 |
0.2.4 2.3.4 0.3.4 2.4.4 |
0.4.4 3.5.4 2.5.4 0.5.4 |
3.6.4 2.6.4 0.6.2 |`,
  },
  {
    name: '指弹分解和弦练习',
    description: 'C–Am–F–G 分解和弦，4/4 拍',
    tex: `\\title "指弹分解和弦练习"
\\subtitle "GuitarTab Studio 示例"
\\tempo 80
.
\\track "Fingerstyle"
(0.5 1.2).8 3.4.8 2.3.8 1.2.8 3.4.8 2.3.8 1.2.8 3.4.8 |
(0.5 1.2).8 2.4.8 2.3.8 1.2.8 2.4.8 2.3.8 1.2.8 2.4.8 |
(1.1 1.2).8 3.4.8 2.3.8 1.2.8 3.4.8 2.3.8 1.2.8 3.4.8 |
(3.6 0.3).8 0.4.8 0.3.8 0.2.8 0.4.8 0.3.8 0.2.8 0.4.8 |`,
  },
  {
    name: '强力和弦节奏练习',
    description: '摇滚强力和弦 riff，带重音',
    tex: `\\title "强力和弦节奏练习"
\\subtitle "GuitarTab Studio 示例"
\\tempo 120
.
\\track "Rhythm"
(0.6 2.5 2.4).8 (0.6 2.5 2.4).8 r.8 (0.6 2.5 2.4).8 (3.6 5.5 5.4).4 (3.6 5.5 5.4).4 |
(5.6 7.5 7.4).8 (5.6 7.5 7.4).8 r.8 (5.6 7.5 7.4).8 (3.6 5.5 5.4).4 (0.6 2.5 2.4).4 |`,
  },
  {
    name: '布鲁斯 12 小节',
    description: '经典 12 小节布鲁斯进行（A 调）',
    tex: `\\title "布鲁斯 12 小节"
\\subtitle "GuitarTab Studio 示例"
\\tempo 100
.
\\track "Blues"
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.4 2.3).4 (0.4 4.3).4 (0.4 2.3).4 (0.4 4.3).4 |
(0.4 2.3).4 (0.4 4.3).4 (0.4 2.3).4 (0.4 4.3).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.6 2.5).4 (0.6 4.5).4 (0.6 2.5).4 (0.6 4.5).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.5 2.4).4 (0.5 4.4).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.4 2.3).4 (0.4 4.3).4 |
(0.5 2.4).4 (0.5 4.4).4 (0.6 2.5).4 r.4 |`,
  },
];
