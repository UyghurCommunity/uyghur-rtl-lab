# ئۇيغۇرچە RTL تەجرىبىخانىسى · Uyghur RTL Lab

An interactive, dependency-free collection of Uyghur mixed-direction examples, copyable HTML/CSS recipes, and a local Unicode inspector.

[Open the lab](https://uyghurcommunity.github.io/uyghur-rtl-lab/) · [UyghurCommunity](https://github.com/UyghurCommunity)

## ئۇيغۇرچە

ئۇيغۇرچە تور بەتتىكى نام، تور ئادرېسى، پۇل سانى، كود ۋە جەدۋەللەرنى قانداق توغرا كۆرسىتىشنى سىناڭ. ھەر بىر مىسالنىڭ HTML ۋە CSS كودىنى كۆرگىلى ۋە كۆچۈرگىلى بولىدۇ.

- ئۇيغۇرچە ۋە ئىنگلىزچە ئىزدەش، تۈر بويىچە سۈزۈش
- مىسال ساندۇقىنى RTL ياكى LTR قىلىپ كۆرۈش
- ئىشلەتكۈچى نامى، URL، سان، يېزىش مەيدانى، ئېلخەت، كود ۋە جەدۋەل مىساللىرى
- Unicode كود نۇقتىلىرى ۋە يوشۇرۇن يۆنىلىش كونترول بەلگىلىرىنى تەكشۈرۈش
- مىساللارنى JSON قىلىپ چۈشۈرۈش
- مەزمۇننى مۇلازىمېتىرغا ئەۋەتمەيدىغان يەرلىك تەكشۈرگۈچ

## Run locally

No dependency installation or build step is required. Use Node 18+ for the checks and any static HTTP server for the website:

```bash
npm test
npm run check
python3 -m http.server 4173
```

Open `http://localhost:4173/`. GitHub Pages can publish the root of `main` directly; `.nojekyll` is included.

## Examples

The eight original fixtures in [`fixtures.js`](fixtures.js) cover:

| Fixture | What it demonstrates |
| --- | --- |
| `mixed-username` | Isolating an LTR handle inside an Uyghur sentence. |
| `url-path` | Keeping URL display order stable and allowing wrapping. |
| `currency` | Grouping a formatted number with its currency label. |
| `auto-input` | Content-based `dir="auto"` for an editable text field. |
| `email-field` | A labelled LTR email field within an RTL context. |
| `code-block` | An explicitly LTR code block containing Uyghur strings. |
| `logical-layout` | Logical padding, border, and layout properties. |
| `table-identifiers` | Semantic table headers and isolated IDs/dates. |

Switching RTL/LTR changes the example container, not the language of the whole site. Explicit directions on emails, code, or isolated tokens remain intentional. Search and filtering rerender the examples; editable example field values are temporary.

The displayed `example.com` addresses and `2026-11-06` date are fixed sample values. No examples claim to supply live exchange rates, language detection, or a full code-editor bidi security solution.

## Reuse fixtures

```js
import { fixtures, filterFixtures, buildRecipe } from './fixtures.js';

const username = filterFixtures('username')[0];
const { html, css } = buildRecipe(username, 'rtl');
```

Use the website's download button to obtain `uyghur-rtl-fixtures.json`, which includes version, license, and all fixture records. Fixture markup is trusted project source; do not inject untrusted HTML into an application.

## Unicode tools

```js
import { inspectText, isolateText, stripDirectionalControls } from './unicode.js';

isolateText('@uyghur_dev', 'ltr'); // LRI + text + PDI
inspectText('سالام @uyghur_dev'); // code points, UTF-16 offsets, script labels
stripDirectionalControls('\u2066hello\u2069'); // 'hello'
```

The inspector distinguishes Unicode code points from UTF-16 offsets and displays up to 160 rows, while preserving the full text totals. `inspectText(text, limit)` allows an explicit limit from 1 through 1000.

**Script labels are not resolved Unicode bidi classes or language detection.** A character labelled “Arabic script” may occur in Uyghur or another language. The browser's full bidirectional algorithm determines final display order.

The cleanup button explicitly removes these directional controls: ALM, LRM, RLM, LRE, RLE, PDF, LRO, RLO, LRI, RLI, FSI, PDI. It preserves ZWJ, ZWNJ, letters, marks, and emoji. Removing controls can change presentation, so cleanup is a separate user action and is never automatic.

## Validation

Node tests cover Unicode isolation, code-point/UTF-16 offsets, control cleanup, HTML escaping, query/category filtering, recipe direction, and the semantic markup requirements of the fixtures. They do not replace visual browser or assistive-technology testing.

## Contributing

Contribute a small, reproducible example with its expected behavior, Uyghur/English explanation, and copyable HTML/CSS. Keep user text local, preserve semantic labels, and add a regression test for the behavior being demonstrated. Keep separately hosted font references distinguishable from the source-code license.

## References

- [W3C: Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/)
- [MDN: The `dir` global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/dir)
- [MDN: The `bdi` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/bdi)

These are guidance links. The fixtures and interface in this repository are original project work.

## License

[MIT](LICENSE), © 2026 UyghurCommunity. No external dataset, font binary, or runtime dependency is bundled. Uyghur text uses the externally linked ALKATIP Basma font, which is separate from the code license.

## Typography

The interface and dynamic Uyghur examples use **ALKATIP Basma**, linked from OnlineWebFonts as WOFF2 with WOFF/TTF fallbacks and `font-display: swap`. No font binaries are redistributed. Tahoma/Arial provide fallback rendering when the external face is unavailable. Inspector text stays local; the browser makes only the normal external font-file request.

The `.alkatip-basma` helper provides `direction: rtl`, `unicode-bidi: embed`, and `line-height: 2.2`. It is applied to the page rather than the example containers, so the interactive RTL/LTR switch, explicit input directions, and bidirectional isolation remain functional. Code uses a monospace face for supported characters and ALKATIP Basma as its Uyghur fallback.

## Demonstration motion

The original directional loom in the hero sends Uyghur and Latin tokens through an isolation gate. Its direction switch uses the same RTL/LTR controls as the examples; it never rewrites editable sample text or inspector input. The visible motion button pauses/resumes the decorative streams and entrance effects. Animation starts paused until the controller is ready, respects reduced motion from first paint, and pauses when the card is offscreen or the document is hidden. The sculpture appears before the long introduction on mobile. Existing fixtures, copied recipes, downloads, and Unicode tools keep their behavior.
