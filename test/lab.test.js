import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fixtures, filterFixtures, buildRecipe } from '../fixtures.js';
import { escapeHTML, isolateText, inspectText, stripDirectionalControls } from '../unicode.js';

test('Unicode isolation uses the requested isolate and always closes it', () => {
  assert.equal(isolateText('abc', 'ltr'), '\u2066abc\u2069');
  assert.equal(isolateText('سالام', 'rtl'), '\u2067سالام\u2069');
  assert.equal(isolateText('mixed'), '\u2068mixed\u2069');
  assert.throws(() => isolateText('x', 'invalid'), TypeError);
  assert.throws(() => isolateText(null), TypeError);
});
test('inspector separates code points from UTF-16 offsets and recognises controls', () => {
  const result = inspectText('سA1👩‍💻\n\u2066');
  assert.equal(result.total, 8); assert.equal(result.utf16Length, 10); assert.equal(result.controls, 1);
  assert.deepEqual(result.rows.map((row) => row.offset), [0, 1, 2, 3, 5, 6, 8, 9]);
  assert.equal(result.rows[0].category, 'Arabic script'); assert.equal(result.rows[1].category, 'Latin script'); assert.equal(result.rows[2].category, 'Number');
  assert.equal(result.rows.at(-1).display, 'LRI'); assert.equal(result.rows.at(-1).codePoint, 'U+2066'); assert.equal(result.rows[6].display, '↵');
});
test('inspection keeps full totals while bounding displayed rows', () => {
  const result = inspectText('ا'.repeat(180), 160); assert.equal(result.rows.length, 160); assert.equal(result.total, 180); assert(result.truncated);
  assert.throws(() => inspectText('', 0), RangeError); assert.throws(() => inspectText('', 1001), RangeError); assert.throws(() => inspectText(null), TypeError);
});
test('explicit directional-control cleanup preserves letters, joiners and emoji', () => {
  const source = '\u061c\u200e\u200f\u202a\u202b\u202c\u202d\u202e\u2066\u2067\u2068\u2069سالام\u200c\u200d👩‍💻';
  assert.equal(stripDirectionalControls(source), 'سالام\u200c\u200d👩‍💻'); assert.equal(inspectText(source).controls, 12);
});
test('user text is HTML-escaped without altering Unicode content', () => {
  assert.equal(escapeHTML('<img src="x" onerror=\'alert(1)\'> & سالام'), '&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt; &amp; سالام');
});
test('filters support Uyghur and English queries, categories and empty states', () => {
  assert.equal(filterFixtures().length, 8); assert.equal(filterFixtures('', 'inline').length, 3); assert.equal(filterFixtures('', 'forms').length, 2); assert.equal(filterFixtures('', 'layout').length, 3);
  assert.equal(filterFixtures(' EMAIL ')[0].id, 'email-field'); assert.equal(filterFixtures('ئىشلەتكۈچى')[0].id, 'mixed-username'); assert.equal(filterFixtures('does-not-exist').length, 0); assert.equal(filterFixtures('email', 'layout').length, 0);
});
test('exported recipes use selected container direction while preserving semantic isolation', () => {
  const username = fixtures.find((fixture) => fixture.id === 'mixed-username'); const rtl = buildRecipe(username), ltr = buildRecipe(username, 'ltr');
  assert(rtl.html.startsWith('<div dir="rtl">')); assert(ltr.html.startsWith('<div dir="ltr">')); assert(rtl.html.includes('<bdi dir="ltr">@uyghur_dev</bdi>!')); assert.equal(rtl.css, username.css); assert.throws(() => buildRecipe(username, 'auto'), TypeError);
});
test('opposite-direction URLs, numbers and table identifiers are explicitly isolated', () => {
  const byId = Object.fromEntries(fixtures.map((fixture) => [fixture.id, fixture]));
  assert.match(byId['url-path'].html, /href="https:\/\/example\.com\/docs\?lang=ug"[^>]*><bdi dir="ltr">https:/);
  assert.match(byId.currency.html, /<bdi dir="ltr" class="amount">1,250\.50 USD<\/bdi>/);
  assert.match(byId['table-identifiers'].html, /<th scope="col">/); assert.match(byId['table-identifiers'].html, /<th scope="row">/);
  assert.match(byId['table-identifiers'].html, /<bdi dir="ltr">DP-104<\/bdi>/); assert.match(byId['table-identifiers'].html, /<bdi dir="ltr">2026-11-06<\/bdi>/);
});
test('forms associate labels and distinguish auto text direction from LTR email', () => {
  const auto = fixtures.find((fixture) => fixture.id === 'auto-input'), email = fixtures.find((fixture) => fixture.id === 'email-field');
  assert.match(auto.html, /for="auto-message"/); assert.match(auto.html, /id="auto-message"[^>]*dir="auto"/); assert.match(email.html, /for="contact-email"/); assert.match(email.html, /type="email" dir="ltr"/); assert.match(auto.css, /text-align: start/);
});
test('layout recipes use logical properties and explicitly LTR code', () => {
  const layout = fixtures.find((fixture) => fixture.id === 'logical-layout'), code = fixtures.find((fixture) => fixture.id === 'code-block');
  assert.match(layout.css, /border-inline-start:/); assert.match(layout.css, /padding-inline:/); assert(!/margin-left|padding-right|border-left/.test(layout.css)); assert.match(code.html, /<pre class="sample-code" dir="ltr">/); assert.match(code.html, /سالام/);
});
test('fixture IDs are unique and fixture markup has no executable scripts or inline events', () => {
  assert.equal(new Set(fixtures.map((fixture) => fixture.id)).size, fixtures.length);
  const ids = fixtures.flatMap((fixture) => [...fixture.html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])); assert.equal(new Set(ids).size, ids.length);
  for (const fixture of fixtures) { assert(!/<script|\son\w+=|javascript:/i.test(fixture.html)); assert(fixture.description && fixture.note && fixture.english); }
});
test('site exposes labelled inspector controls and a polite result count', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<html lang="ug" dir="rtl">/); assert.match(html, /<script type="module" src="app.js">/); assert.match(html, /for="inspect-input"/); assert.match(html, /id="inspect-input"[^>]*dir="auto"/); assert.match(html, /id="result-count" role="status" aria-live="polite"/);
});
