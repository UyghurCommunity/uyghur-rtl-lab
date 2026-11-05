/** These examples are original project fixtures, not a language corpus. */
export const fixtures = Object.freeze([
  {
    id: 'mixed-username', category: 'inline', title: 'ئىشلەتكۈچى نامى', english: 'Usernames and punctuation',
    description: 'ئىنگلىزچە نامنى ئۆز ئالدىغا ئايرىڭ. تىنىش بەلگىسى جۈملىنىڭ بىر قىسمى بولۇپ قالىدۇ.',
    html: '<p class="sample-line">سالام، <bdi dir="ltr">@uyghur_dev</bdi>! يېڭى تۈرىڭىزگە خۇش كەلدىڭىز.</p>',
    css: '.sample-line { line-height: 2; }\nbdi { unicode-bidi: isolate; }',
    note: 'Use bdi for user-supplied names. dir="ltr" is explicit here because the handle uses Latin characters.',
  },
  {
    id: 'url-path', category: 'inline', title: 'ئۇلىنىش ۋە تور ئادرېسى', english: 'URLs and paths',
    description: 'تور ئادرېسىنى سولدىن ئوڭغا كۆرسىتىپ، ئۇزۇن ئادرېسلارنى كىچىك ئېكرانغا ماسلاشتۇرۇڭ.',
    html: '<p class="sample-line">قوللانما: <a class="sample-url" href="https://example.com/docs?lang=ug"><bdi dir="ltr">https://example.com/docs?lang=ug</bdi></a></p>',
    css: '.sample-url { overflow-wrap: anywhere; }\n.sample-url bdi { unicode-bidi: isolate; }',
    note: 'The URL is an example.com documentation example. Isolate displayed text, and keep the actual href unchanged.',
  },
  {
    id: 'currency', category: 'inline', title: 'سان ۋە پۇل بىرلىكى', english: 'Amounts and currency labels',
    description: 'سان بىلەن بىرلىك بىر گۇرۇپپا بولسۇن. كەسىر، پەش ۋە ھەرپلەرنىڭ تەرتىپى ساقلىنىدۇ.',
    html: '<p class="sample-line">جەمئىي: <bdi dir="ltr" class="amount">1,250.50 USD</bdi><br>سانى: <bdi dir="ltr">12 / 24</bdi></p>',
    css: '.amount { font-variant-numeric: tabular-nums; }\nbdi { unicode-bidi: isolate; }',
    note: 'This is a fixed formatting fixture, not a live exchange rate or a recommendation for a particular numeral system.',
  },
  {
    id: 'auto-input', category: 'forms', title: 'ئىككى تىللىق يېزىش مەيدانى', english: 'Automatic input direction',
    description: 'مەزمۇننىڭ تۇنجى كۈچلۈك ھەرپى كىرگۈزۈش يۆنىلىشىنى تاللىسۇن. ئۇيغۇرچە ۋە ئىنگلىزچە سىناڭ.',
    html: '<label class="sample-label" for="auto-message">بىر جۈملە يېزىڭ / Write a sentence</label>\n<input class="sample-input" id="auto-message" type="text" dir="auto" value="سالام دۇنيا" autocomplete="off">',
    css: '.sample-label { display: block; margin-block-end: .6rem; }\n.sample-input { width: 100%; text-align: start; padding: .8rem 1rem; }',
    note: 'dir="auto" determines paragraph direction from content. It does not detect or translate the language.',
  },
  {
    id: 'email-field', category: 'forms', title: 'ئېلخەت رامكىسى', english: 'LTR email field in an RTL form',
    description: 'بەلگە ئۇيغۇرچە، ئادرېس سولدىن ئوڭغا. بەلگە بىلەن رامكا ئارىسىدىكى باغلىنىش ساقلىنىدۇ.',
    html: '<label class="sample-label" for="contact-email">ئېلخەت ئادرېسى</label>\n<input class="sample-input" id="contact-email" type="email" dir="ltr" value="hello@example.com" autocomplete="email">',
    css: '.sample-label { display: block; margin-block-end: .6rem; }\n.sample-input { width: 100%; text-align: start; padding: .8rem 1rem; }',
    note: 'The field stays LTR because email addresses use that structure. The surrounding label follows the page direction.',
  },
  {
    id: 'code-block', category: 'layout', title: 'كود بىلەن ئۇيغۇرچە تېكىست', english: 'Code blocks with Uyghur strings',
    description: 'كود بۆلىكىنىڭ ئاساسىي يۆنىلىشىنى ئېنىق بەلگىلەڭ. ئۇيغۇرچە ھەرپلەر ئۆز شەكلىدە كۆرۈنىدۇ.',
    html: '<pre class="sample-code" dir="ltr"><code>const greeting = "سالام، دۇنيا!";\nconsole.log(greeting);</code></pre>',
    css: '.sample-code { text-align: left; overflow-x: auto; padding: 1rem; }\n.sample-code code { font-family: ui-monospace, Tahoma, monospace; }',
    note: 'A code editor may need additional bidi protections. This fixture demonstrates an explicitly LTR, read-only code block.',
  },
  {
    id: 'logical-layout', category: 'layout', title: 'يۆنىلىشكە ماس ئارىلىق', english: 'Logical spacing and borders',
    description: 'ئوڭ ياكى سولنى مۇقىملاش ئورنىغا، باشلىنىش ۋە ئاخىرلىشىش تەرەپلىرىنى ئىشلىتىڭ.',
    html: '<div class="logical-card"><span class="logical-dot" aria-hidden="true"></span><div><strong>ئېچىشقا تەييار</strong><p>يۆنىلىشنى ئالماشتۇرۇپ كۆرۈڭ.</p></div></div>',
    css: '.logical-card { display: flex; gap: 1rem; padding-inline: 1rem; border-inline-start: 3px solid #2b8c87; }\n.logical-dot { width: .6rem; height: .6rem; margin-block-start: .7rem; border-radius: 50%; background: #2b8c87; flex-shrink: 0; }',
    note: 'Logical properties follow the containing direction. The page-direction switch above the examples makes this visible.',
  },
  {
    id: 'table-identifiers', category: 'layout', title: 'جەدۋەلدىكى كود ۋە سان', english: 'Tables with stable identifiers',
    description: 'مەھسۇلات نامى ئۇيغۇرچە بولسىمۇ، كود ۋە چېسلا تەرتىپىنى ئايرىم ساقلاڭ.',
    html: '<div class="sample-table-wrap"><table class="sample-table"><caption>تۈر ھالىتى</caption><thead><tr><th scope="col">تۈر</th><th scope="col">كود</th><th scope="col">چېسلا</th></tr></thead><tbody><tr><th scope="row">دوپپا</th><td><bdi dir="ltr">DP-104</bdi></td><td><bdi dir="ltr">2026-11-06</bdi></td></tr></tbody></table></div>',
    css: '.sample-table-wrap { overflow-x: auto; }\n.sample-table { border-collapse: collapse; width: 100%; text-align: start; }\n.sample-table th, .sample-table td { padding: .6rem; border-block-end: 1px solid #ccd8dd; }',
    note: 'The date and identifier are fixed test values. Real applications should choose a date format appropriate to their users.',
  },
]);
export const categories = Object.freeze(['all', 'inline', 'forms', 'layout']);
export function filterFixtures(query = '', category = 'all') {
  const needle = String(query).trim().toLocaleLowerCase('en');
  return fixtures.filter((fixture) => (category === 'all' || fixture.category === category) && (!needle || [fixture.title, fixture.english, fixture.description, fixture.note, fixture.id].some((value) => value.toLocaleLowerCase('en').includes(needle))));
}
export function buildRecipe(fixture, direction = 'rtl') {
  if (!['rtl', 'ltr'].includes(direction)) throw new TypeError('direction must be rtl or ltr');
  return { html: `<div dir="${direction}">\n${fixture.html}\n</div>`, css: fixture.css };
}
