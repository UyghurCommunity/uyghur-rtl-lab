/** Unicode bidi controls are reported explicitly; script labels are not resolved bidi classes. */
export const DIRECTIONAL_CONTROLS = Object.freeze({
  '\u061c': 'ALM', '\u200e': 'LRM', '\u200f': 'RLM', '\u202a': 'LRE', '\u202b': 'RLE',
  '\u202c': 'PDF', '\u202d': 'LRO', '\u202e': 'RLO', '\u2066': 'LRI', '\u2067': 'RLI', '\u2068': 'FSI', '\u2069': 'PDI',
});
export function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
export function isolateText(text, direction = 'auto') {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  const opening = { auto: '\u2068', rtl: '\u2067', ltr: '\u2066' }[direction];
  if (!opening) throw new TypeError('direction must be auto, rtl, or ltr');
  return opening + text + '\u2069';
}
export function stripDirectionalControls(text) {
  return [...String(text)].filter((char) => !DIRECTIONAL_CONTROLS[char]).join('');
}
export function inspectText(text, limit = 160) {
  if (typeof text !== 'string') throw new TypeError('text must be a string');
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000) throw new RangeError('limit must be an integer from 1 to 1000');
  const characters = [...text];
  let offset = 0;
  const rows = characters.slice(0, limit).map((char, index) => {
    const control = DIRECTIONAL_CONTROLS[char];
    const category = control ? 'Directional control' : /\s/u.test(char) ? 'Whitespace' : /\p{Script=Arabic}/u.test(char) ? 'Arabic script' : /\p{Script=Latin}/u.test(char) ? 'Latin script' : /\p{Number}/u.test(char) ? 'Number' : /\p{Mark}/u.test(char) ? 'Combining mark' : 'Symbol / other';
    const row = { index, offset, character: char, display: control || ({ ' ': '␣', '\n': '↵', '\r': '␍', '\t': '⇥' })[char] || char, codePoint: 'U+' + char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'), category, control: control || null };
    offset += char.length;
    return row;
  });
  return { rows, total: characters.length, utf16Length: text.length, controls: characters.filter((char) => DIRECTIONAL_CONTROLS[char]).length, truncated: characters.length > limit };
}
