import { fixtures, filterFixtures, buildRecipe } from './fixtures.js';
import { escapeHTML, inspectText, isolateText, stripDirectionalControls } from './unicode.js';
const $ = (id) => document.getElementById(id);
let category = 'all', direction = 'rtl', query = '', toastTimer;
const categoryNames = { inline: 'تېكىست', forms: 'يېزىش مەيدانى', layout: 'ئورۇنلاشتۇرۇش' };
function announce(message) {
  $('toast').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('toast').textContent = ''; }, 2800);
}
function recipeSection(label, code, fixtureId, kind) {
  return `<section class="recipe-code"><div><span>${label}</span><button type="button" class="text-button" data-copy="${fixtureId}" data-kind="${kind}">كۆچۈرۈش ⧉</button></div><pre dir="ltr" tabindex="0"><code>${escapeHTML(code)}</code></pre></section>`;
}
function renderFixtures() {
  const found = filterFixtures(query, category);
  $('fixture-grid').innerHTML = found.map((fixture) => {
    const recipe = buildRecipe(fixture, direction);
    // Only project-owned static fixture markup is rendered as HTML. User input
    // enters the Unicode inspector through textContent/escapeHTML instead.
    return `<article class="example-card" aria-labelledby="title-${fixture.id}"><div class="example-copy"><span class="example-index">${String(fixtures.indexOf(fixture) + 1).padStart(2, '0')} / ${categoryNames[fixture.category]}</span><h3 id="title-${fixture.id}">${escapeHTML(fixture.title)}</h3><span class="example-english" lang="en" dir="ltr">${escapeHTML(fixture.english)}</span><p>${escapeHTML(fixture.description)}</p></div><div class="example-preview" dir="${direction}">${fixture.html}</div><details class="recipe-details"><summary><span>كود ۋە چۈشەندۈرۈش / HTML + CSS</span><span aria-hidden="true">+</span></summary><p class="recipe-note" lang="en">${escapeHTML(fixture.note)}</p>${recipeSection('HTML', recipe.html, fixture.id, 'html')}${recipeSection('CSS', recipe.css, fixture.id, 'css')}</details></article>`;
  }).join('');
  $('result-count').textContent = `${found.length} / ${fixtures.length} مىسال`;
  $('empty-state').hidden = found.length > 0;
}
$('search').addEventListener('input', (event) => { query = event.target.value; renderFixtures(); });
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  category = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  renderFixtures();
}));
document.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => {
  direction = button.dataset.direction;
  document.querySelectorAll('[data-direction]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  renderFixtures();
}));
$('fixture-grid').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const fixture = fixtures.find((item) => item.id === button.dataset.copy);
  if (!fixture || !['html', 'css'].includes(button.dataset.kind)) return;
  try { await navigator.clipboard.writeText(buildRecipe(fixture, direction)[button.dataset.kind]); announce('كود كۆچۈرۈلدى ✓'); }
  catch { announce('كۆچۈرگىلى بولمىدى. كودنى تاللاپ كۆچۈرۈڭ.'); }
});
$('download-fixtures').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ version: '0.1.0', license: 'MIT', fixtures }, null, 2) + '\n'], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = 'uyghur-rtl-fixtures.json'; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('مىساللار چۈشۈرۈلدى.');
});
function renderInspector() {
  const result = inspectText($('inspect-input').value);
  $('codepoint-count').textContent = result.total;
  $('control-count').textContent = result.controls;
  $('truncation-note').textContent = result.truncated ? 'ئالدىنقى 160 كود نۇقتىسى' : '';
  $('inspect-rows').innerHTML = result.rows.map((row) => `<tr${row.control ? ' class="is-control"' : ''}><td><bdi dir="ltr">${row.index}</bdi></td><td><bdi dir="auto">${escapeHTML(row.display)}</bdi></td><td><bdi dir="ltr">${row.codePoint}</bdi></td><td lang="en" dir="ltr">${row.category}</td></tr>`).join('');
  if (!result.rows.length) $('inspect-rows').innerHTML = '<tr><td colspan="4">تەكشۈرۈش ئۈچۈن بىر جۈملە يېزىڭ.</td></tr>';
}
$('inspect-input').addEventListener('input', renderInspector);
$('insert-control-sample').addEventListener('click', () => {
  $('inspect-input').value = 'سالام، ' + isolateText('@uyghur_dev', 'ltr') + '!';
  renderInspector(); announce('LRI ۋە PDI ئايرىغۇچلىرى قوشۇلدى.');
});
$('remove-controls').addEventListener('click', () => {
  const old = $('inspect-input').value, next = stripDirectionalControls(old);
  $('inspect-input').value = next; renderInspector();
  announce(old === next ? 'يۆنىلىش كونترول بەلگىسى يوق.' : 'يۆنىلىش كونترول بەلگىلىرى ئېلىۋېتىلدى.');
});
renderFixtures();
renderInspector();
