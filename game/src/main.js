import "./style.css";
import {
  statKeys,
  statLabel,
  statMax,
  createState,
  isEnding,
  missingRequirement,
  applyChoice,
  diffStats,
  resolveOverload,
  nearOverload,
  loadRun,
  saveRun,
  clearRun,
  loadEndings,
  unlockEnding,
} from "./engine.js";

const LANGS = ["vi", "en"];
const LANG_KEY = "ai-career-game:lang";
// Chỉ dùng khi chưa tải được file truyện (khi đó chưa có meta.ui).
const FALLBACK = {
  vi: { loadFail: "Không tải được dữ liệu truyện", retry: "Thử lại" },
  en: { loadFail: "Could not load the story data", retry: "Retry" },
};

const app = document.getElementById("app");
const stories = {}; // lang -> nội dung truyện đã tải
let lang = "vi";
let story = null;
let state = null;
let view = "title"; // title | node | library
let lastDelta = [];

const pad = (n) => String(n).padStart(2, "0");

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );
}

// Chữ giao diện nằm trong story.meta.ui của ngôn ngữ đang chọn; {tên} được thay bằng vars.
const ui = (key, vars = {}) =>
  String(story.meta.ui[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
const uiMap = (group, key) => story.meta.ui[group]?.[key];

function paragraphs(text) {
  return String(text ?? "")
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block) => `<p>${esc(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

const levelName = (n) => story.meta.levelNames?.[n - 1] ?? "";

function allEndings() {
  return Object.entries(story.nodes)
    .filter(([, node]) => isEnding(node))
    .map(([id, node]) => ({ id, level: node.level, ...node.ending }));
}

// keepPlace: đổi ngôn ngữ thì giữ nguyên vị trí cuộn, không chạy lại hiệu ứng vào cảnh.
function show(html, { focus = "h1", keepPlace = false } = {}) {
  const y = window.scrollY;
  app.classList.toggle("still", keepPlace);
  app.innerHTML = html;
  window.scrollTo(0, keepPlace ? y : 0);
  const el = app.querySelector(focus);
  if (el) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

function langSwitch() {
  return `<div class="lang" role="group" aria-label="${esc(ui("langLabel"))}">
    ${LANGS.map((l) => `<button data-lang="${l}" aria-pressed="${l === lang}" lang="${l}">${l.toUpperCase()}</button>`).join("")}
  </div>`;
}

const topbar = (extra = "") =>
  `<div class="topbar"><span class="brand">${esc(ui("brand"))}</span>${extra}${langSwitch()}</div>`;

function levelTrack(current) {
  return `
    <ol class="track" aria-label="${esc(ui("trackLabel"))}">
      ${[1, 2, 3, 4, 5, 6, 7]
        .map((n) => {
          const cls = n < current ? "done" : n === current ? "now" : "";
          return `<li class="${cls}" ${n === current ? 'aria-current="step"' : ""}>
            <i>${n}</i><span>${esc(levelName(n))}</span>
          </li>`;
        })
        .join("")}
    </ol>`;
}

function meter(key, value) {
  const max = statMax(story, key);
  const warn = story.meta.overload?.stat === key && nearOverload(story, { [key]: value });
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `
    <div class="meter ${value < 0 ? "neg" : ""} ${warn ? "warn" : ""}" data-k="${esc(key)}">
      <div class="meter-head"><span>${esc(statLabel(story, key))}</span><b>${value}</b></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>`;
}

function renderTitle(opts) {
  view = "title";
  const run = loadRun(story);
  const endings = allEndings();
  const got = loadEndings().filter((id) => endings.some((e) => e.id === id)).length;
  const hasRun = Boolean(run);
  show(
    `
    <main class="title">
      ${topbar()}
      <p class="kicker">${esc(ui("titleKicker", { n: endings.length }))}</p>
      <h1>${esc(story.meta.title)}</h1>
      <p class="lede">${esc(story.meta.tagline ?? "")}</p>
      <div class="ladder" aria-hidden="true">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<i style="--n:${n}">${n}</i>`).join("")}</div>
      <div class="actions">
        ${hasRun ? `<button class="btn primary" data-action="continue"><kbd>↵</kbd>${esc(ui("continue", { n: pad(story.nodes[run.nodeId].level) }))}</button>` : ""}
        <button class="btn ${hasRun ? "" : "primary"}" data-action="start">${hasRun ? "" : "<kbd>↵</kbd>"}${esc(ui(hasRun ? "restart" : "start"))}</button>
        <button class="btn ghost" data-action="library">${esc(ui("library", { got, total: endings.length }))}</button>
      </div>
      <p class="credit">${esc(story.meta.credit ?? "")}</p>
    </main>`,
    { focus: opts?.keepPlace ? '.lang [aria-pressed="true"]' : "h1", ...opts },
  );
}

function choiceButton(choice, index) {
  const missing = missingRequirement(choice, state.stats);
  const effects = Object.entries(choice.effects || {})
    .map(([key, d]) => `${d > 0 ? "+" : ""}${d} ${statLabel(story, key)}`)
    .join(" · ");
  const meta = missing
    ? ui("needs", { stat: statLabel(story, missing.key), need: missing.need, have: missing.have })
    : story.meta.showEffects
      ? effects
      : "";
  return `
    <button class="choice ${missing ? "locked" : ""}" data-choice="${index}" ${missing ? "disabled" : ""}>
      <kbd>${missing ? "×" : index + 1}</kbd>
      <span class="choice-body">
        <span class="choice-label">${esc(choice.label)}</span>
        ${meta ? `<span class="choice-meta">${esc(meta)}</span>` : ""}
      </span>
    </button>`;
}

function renderNode(opts) {
  view = "node";
  const node = story.nodes[state.nodeId];
  if (!node) return renderBroken();
  if (isEnding(node)) return renderEnding(node, opts);

  const delta = lastDelta
    .map(([key, d]) => `<span class="chip ${d > 0 ? "up" : "down"}" data-k="${esc(key)}">${esc(statLabel(story, key))} ${d > 0 ? "+" : ""}${d}</span>`)
    .join("");

  show(
    `
    <header class="hud">
      ${topbar(`<span class="step">${esc(ui("step", { n: pad(state.steps + 1) }))}</span>`)}
      ${levelTrack(node.level)}
      <section class="meters" aria-label="${esc(ui("statsLabel"))}">${statKeys(story).map((key) => meter(key, state.stats[key] ?? 0)).join("")}</section>
      ${nearOverload(story, state.stats) ? `<p class="alert" role="status">${esc(story.meta.overload.warning ?? "")}</p>` : ""}
    </header>
    <main class="scene">
      <p class="kicker">${esc(ui("levelKicker", { n: pad(node.level), name: levelName(node.level) }))}</p>
      ${delta ? `<p class="delta" aria-label="${esc(ui("deltaLabel"))}"><span class="arrow">&gt;</span>${delta}</p>` : ""}
      <h1>${esc(node.title)}</h1>
      <div class="text">${paragraphs(node.text)}</div>
      ${node.fact ? `<aside class="fact"><b>${esc(ui("factTitle"))}</b><p>${esc(node.fact)}</p></aside>` : ""}
      <div class="choices">${(node.choices || []).map(choiceButton).join("")}</div>
    </main>`,
    { focus: opts?.keepPlace ? '.lang [aria-pressed="true"]' : "h1", ...opts },
  );
}

function renderEnding(node, opts) {
  const ending = node.ending;
  const done = unlockEnding(state.nodeId);
  const total = allEndings().length;
  clearRun();
  show(
    `
    <main class="scene ending ${esc(ending.type)}">
      ${topbar()}
      <p class="kicker">${esc(ui("endKicker", { n: pad(node.level) }))}</p>
      <p class="badge ${esc(ending.type)}">${esc(uiMap("endingLabels", ending.type) ?? uiMap("endingLabels", "other"))}</p>
      <h1>${esc(ending.title)}</h1>
      <div class="text">${paragraphs(node.text)}</div>
      <p class="summary">${esc(ending.summary)}</p>
      <p class="source"><span class="tag">${esc(uiMap("sourceLabels", ending.source) ?? "")}</span> ${esc(ui("endStats", { steps: state.steps, got: done.length, total }))}</p>
      <div class="finals">${statKeys(story).map((key) => `<span class="pill" data-k="${esc(key)}">${esc(statLabel(story, key))} <b>${state.stats[key] ?? 0}</b></span>`).join("")}</div>
      <div class="actions">
        <button class="btn primary" data-action="start"><kbd>↵</kbd>${esc(ui("replay"))}</button>
        <button class="btn" data-action="library">${esc(ui("libraryBtn"))}</button>
        <button class="btn ghost" data-action="home">${esc(ui("home"))}</button>
      </div>
    </main>`,
    { focus: opts?.keepPlace ? '.lang [aria-pressed="true"]' : "h1", ...opts },
  );
}

function renderLibrary(opts) {
  view = "library";
  const got = new Set(loadEndings());
  const endings = allEndings().sort((a, b) => a.level - b.level);
  show(
    `
    <main class="scene library">
      ${topbar()}
      <p class="kicker">${esc(ui("libKicker"))}</p>
      <h1>${esc(ui("libTitle", { got: endings.filter((e) => got.has(e.id)).length, total: endings.length }))}</h1>
      <ul class="cards">
        ${endings
          .map((e) =>
            got.has(e.id)
              ? `<li class="card ${esc(e.type)}">
                  <p class="badge ${esc(e.type)}">${esc(uiMap("endingLabels", e.type) ?? "")}</p>
                  <h2>${esc(e.title)}</h2>
                  <p>${esc(e.summary)}</p>
                  <p class="source"><span class="tag">${esc(uiMap("sourceLabels", e.source) ?? "")}</span> ${esc(ui("libLevel", { n: pad(e.level) }))}</p>
                </li>`
              : `<li class="card locked"><p class="badge">???</p><h2>${esc(ui("locked"))}</h2><p>${esc(ui("lockedHint"))}</p></li>`,
          )
          .join("")}
      </ul>
      <div class="actions"><button class="btn primary" data-action="home">${esc(ui("backHome"))}</button></div>
    </main>`,
    { focus: opts?.keepPlace ? '.lang [aria-pressed="true"]' : "h1", ...opts },
  );
}

function renderBroken() {
  show(`
    <main class="scene">
      ${topbar()}
      <h1>${esc(ui("brokenTitle"))}</h1>
      <p class="text">${esc(ui("brokenText"))}</p>
      <div class="actions"><button class="btn primary" data-action="start">${esc(ui("restartBtn"))}</button></div>
    </main>`);
}

function render(opts) {
  if (view === "library") renderLibrary(opts);
  else if (view === "node" && state) renderNode(opts);
  else renderTitle(opts);
}

function startRun(resume) {
  state = (resume ? loadRun(story) : null) ?? createState(story);
  lastDelta = [];
  saveRun(state);
  renderNode();
}

function choose(index) {
  const choice = story.nodes[state.nodeId]?.choices?.[index];
  if (!choice || missingRequirement(choice, state.stats)) return;
  const before = state.stats;
  state = resolveOverload(story, applyChoice(state, choice));
  lastDelta = diffStats(before, state.stats);
  if (!story.nodes[state.nodeId]) return renderBroken();
  saveRun(state);
  renderNode();
}

async function loadStory(l) {
  if (stories[l]) return stories[l];
  const response = await fetch(`${import.meta.env.BASE_URL}story.${l}.json`, { cache: "no-cache" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  stories[l] = await response.json();
  return stories[l];
}

// Đổi ngôn ngữ ngay cả giữa lúc chơi: state (node, chỉ số) dùng chung, chỉ đổi bản chữ.
async function setLang(next) {
  if (next === lang && story) return;
  try {
    const data = await loadStory(next);
    lang = next;
    story = data;
  } catch {
    return; // giữ ngôn ngữ cũ nếu bản kia không tải được
  }
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // không lưu được thì thôi
  }
  document.documentElement.lang = lang;
  document.title = story.meta.title;
  if (state && !story.nodes[state.nodeId]) {
    state = null;
    view = "title";
  }
  render({ keepPlace: true });
}

function act(action) {
  if (action === "start") startRun(false);
  else if (action === "continue") startRun(true);
  else if (action === "library") renderLibrary();
  else if (action === "home") renderTitle();
  else if (action === "reload") location.reload();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-choice], [data-lang]");
  if (!target) return;
  if (target.dataset.lang) setLang(target.dataset.lang);
  else if (target.dataset.choice !== undefined) choose(Number(target.dataset.choice));
  else act(target.dataset.action);
});

// Phím số chọn lựa chọn, Enter bấm nút chính, L đổi ngôn ngữ.
document.addEventListener("keydown", (event) => {
  if (!story || event.metaKey || event.ctrlKey || event.altKey) return;
  if (/^[1-9]$/.test(event.key)) {
    app.querySelector(`[data-choice="${Number(event.key) - 1}"]:not([disabled])`)?.click();
  } else if (event.key === "Enter" && document.activeElement?.tagName !== "BUTTON") {
    app.querySelector(".btn.primary")?.click();
  } else if (event.key.toLowerCase() === "l") {
    setLang(lang === "vi" ? "en" : "vi");
  }
});

function initialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // bỏ qua
  }
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "vi";
}

async function boot() {
  lang = initialLang();
  try {
    story = await loadStory(lang);
  } catch (error) {
    const t = FALLBACK[lang];
    app.innerHTML = `
      <main class="scene">
        <h1>${esc(t.loadFail)}</h1>
        <p class="text">${esc(error.message)}</p>
        <div class="actions"><button class="btn primary" data-action="reload">${esc(t.retry)}</button></div>
      </main>`;
    return;
  }
  document.documentElement.lang = lang;
  document.title = story.meta.title;
  renderTitle();
}

boot();
