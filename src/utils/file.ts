/** Read a File/Blob into an ArrayBuffer. */
export function readAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

/** Read a File/Blob as UTF-8 text. */
export function readAsText(file: Blob): Promise<string> {
  return file.text();
}

/** Clamp a number into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Round to N decimals. */
export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
