import * as alphaTab from '@coderline/alphatab';

/**
 * alphaTab asset wiring for Vite.
 *
 * alphaTab needs three kinds of runtime assets:
 *  - the SMuFL music font (Bravura) for engraving glyphs → served from /font/
 *  - a soundfont (.sf2) for the synthesizer → served from /soundfont/
 *  - a background worker for layout/rendering (handled automatically because we
 *    exclude @coderline/alphatab from Vite's dep optimizer and use ES workers).
 *
 * The font directory and soundfont are copied into `public/` by
 * `scripts/copy-assets.mjs` (wired into the predev/prebuild npm scripts), so
 * they are available at these stable URLs in both dev and production builds.
 */
const ASSET_BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const FONT_DIRECTORY = `${ASSET_BASE}font/`;
export const SOUND_FONT_URL = `${ASSET_BASE}soundfont/sonivox.sf2`;

/**
 * Apply narrow compatibility fixes without changing the AlphaTex saved by the user.
 * alphaTab 1.8.4 crashes when a numbered staff contains a whole-bar `r.1` rest,
 * while two half rests render correctly and have the same silent duration.
 */
export function prepareAlphaTexForRendering(tex: string) {
  return tex
    .split(/(?=^[\t ]*\\track\b)/gm)
    .map((trackBlock) => {
      if (!/\\staff\s*\{[^}]*\bnumbered\b[^}]*\}/.test(trackBlock)) {
        return trackBlock;
      }

      return trackBlock.replace(
        /^([\t ]*)r[\t ]*\.[\t ]*1[\t ]*\|[\t ]*(\/\/[^\r\n]*)?$/gm,
        (_match, indentation: string, comment: string | undefined) =>
          `${indentation}r.2 r.2 |${comment ? ` ${comment}` : ''}`,
      );
    })
    .join('');
}

export interface CreateApiOptions {
  /** The element alphaTab renders into. */
  element: HTMLElement;
  /** The scrolling viewport used for cursor auto-scroll. */
  scrollElement: HTMLElement;
  /** Initial rendering scale (zoom). */
  scale?: number;
}

/**
 * Build an AlphaTabApi instance configured for structured tab rendering with
 * playback, an animated beat cursor, and metronome/count-in support.
 */
export function createAlphaTabApi(opts: CreateApiOptions): alphaTab.AlphaTabApi {
  const settings = new alphaTab.Settings();

  settings.core.fontDirectory = FONT_DIRECTORY;
  settings.core.engine = 'svg';
  settings.core.logLevel = alphaTab.LogLevel.Warning;

  // The npm package only ships Bravura.otf (no woff/woff2), so we point the
  // SMuFL font source directly at the OpenType file. This avoids two 404s from
  // the default woff2 → woff → otf fallback chain.
  const fontSources = new Map<alphaTab.FontFileFormat, string>();
  fontSources.set(alphaTab.FontFileFormat.OpenType, `${FONT_DIRECTORY}Bravura.otf`);
  settings.core.smuflFontSources = fontSources;

  // Respect each staff's explicit notation type (tabs, numbered notation, etc.).
  settings.display.scale = opts.scale ?? 1;
  settings.display.stretchForce = 1;
  settings.display.layoutMode = alphaTab.LayoutMode.Page;
  settings.display.staveProfile = alphaTab.StaveProfile.Default;
  settings.display.barsPerRow = opts.element.clientWidth >= 900 ? 4 : -1;
  settings.display.systemPaddingTop = 6;
  settings.display.systemPaddingBottom = 6;
  settings.display.trackStaffPaddingBetween = 0;
  settings.display.effectBandPaddingBottom = 1;
  settings.display.lyricLinesPaddingBetween = 2;
  // The practice header already owns BPM; hiding the duplicate marker leaves
  // the first chord diagram and section label a clean shared band.
  settings.notation.elements.set(alphaTab.NotationElement.EffectTempo, false);
  settings.notation.elements.set(alphaTab.NotationElement.EffectDynamics, false);

  const scoreFont = 'Arial, Microsoft YaHei, PingFang SC, sans-serif';
  settings.display.resources.numberedNotationFont = new alphaTab.model.Font(
    scoreFont,
    18,
    alphaTab.model.FontStyle.Plain,
  );
  settings.display.resources.elementFonts.set(
    alphaTab.NotationElement.EffectLyrics,
    new alphaTab.model.Font(
      scoreFont,
      16,
      alphaTab.model.FontStyle.Plain,
    ),
  );
  settings.display.resources.elementFonts.set(
    alphaTab.NotationElement.EffectChordNames,
    new alphaTab.model.Font(
      'Georgia, Microsoft YaHei, serif',
      13,
      alphaTab.model.FontStyle.Plain,
      alphaTab.model.FontWeight.Bold,
    ),
  );
  settings.display.resources.elementFonts.set(
    alphaTab.NotationElement.ChordDiagrams,
    new alphaTab.model.Font(
      'Georgia, Microsoft YaHei, serif',
      13,
      alphaTab.model.FontStyle.Plain,
      alphaTab.model.FontWeight.Bold,
    ),
  );

  // Player: real synthesized playback + animated cursor following the beat.
  settings.player.enablePlayer = true;
  settings.player.enableCursor = true;
  settings.player.enableAnimatedBeatCursor = true;
  settings.player.enableUserInteraction = true;
  settings.player.soundFont = SOUND_FONT_URL;
  settings.player.scrollElement = opts.scrollElement;
  // The practice view scrolls by score systems with one-line overlap.
  settings.player.scrollMode = alphaTab.ScrollMode.Off;
  settings.player.scrollOffsetY = -24;

  const api = new alphaTab.AlphaTabApi(opts.element, settings);
  return api;
}

/**
 * Convert a 1-based bar range into an alphaTab tick playback range for looping.
 * Returns null when the range is invalid or the score is not loaded.
 */
export function barRangeToPlaybackRange(
  api: alphaTab.AlphaTabApi,
  startBar: number | null,
  endBar: number | null,
): alphaTab.synth.PlaybackRange | null {
  const score = api.score;
  if (!score || startBar == null || endBar == null) return null;

  const bars = score.masterBars;
  if (bars.length === 0) return null;

  const s = Math.max(1, Math.min(startBar, bars.length));
  const e = Math.max(s, Math.min(endBar, bars.length));

  const startTick = bars[s - 1].start;
  const endMaster = bars[e - 1];
  const endTick = endMaster.start + endMaster.calculateDuration();

  const range = new alphaTab.synth.PlaybackRange();
  range.startTick = startTick;
  range.endTick = endTick;
  return range;
}
