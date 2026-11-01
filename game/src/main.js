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

const ENDING_LABELS = { good: "Kết tốt", bad: "Kết xấu", neutral: "Kết trung lập" };
const SOURCE_LABELS = { video: "Theo video gốc", extended: "Nội dung mở rộng" };

const app = document.getElementById("app");
let story = null;
let state = null;
let lastDelta = [];

const pad = (n) => String(n).padStart(2, "0");

function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch],
  );
}

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

function show(html, focusSelector = "h1") {
  app.innerHTML = html;
  window.scrollTo(0, 0);
  const el = app.querySelector(focusSelector);
  if (el) {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

function levelTrack(current) {
  return `
    <ol class="track" aria-label="Tiến trình cấp bậc">
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

function renderTitle() {
  const run = loadRun(story);
  const endings = allEndings();
  const got = loadEndings().filter((id) => endings.some((e) => e.id === id)).length;
  show(`
    <main class="title">
      <p class="kicker">// game chọn lựa · ${endings.length} cái kết</p>
      <h1>${esc(story.meta.title)}</h1>
      <p class="lede">${esc(story.meta.tagline ?? "")}</p>
      <div class="ladder" aria-hidden="true">${[1, 2, 3, 4, 5, 6, 7].map((n) => `<i style="--n:${n}">${n}</i>`).join("")}</div>
      <div class="actions">
        ${run ? `<button class="btn primary" data-action="continue"><kbd>↵</kbd>Tiếp tục · cấp ${pad(story.nodes[run.nodeId].level)}/07</button>` : ""}
        <button class="btn ${run ? "" : "primary"}" data-action="start">${run ? "Chơi lại từ đầu" : '<kbd>↵</kbd>Bắt đầu'}</button>
        <button class="btn ghost" data-action="library">Thư viện kết · ${got}/${endings.length}</button>
      </div>
      <p class="credit">${esc(story.meta.credit ?? "")}</p>
    </main>`);
}

function choiceButton(choice, index) {
  const missing = missingRequirement(choice, state.stats);
  const effects = Object.entries(choice.effects || {})
    .map(([key, d]) => `${d > 0 ? "+" : ""}${d} ${statLabel(story, key)}`)
    .join(" · ");
  const meta = missing
    ? `Cần ${statLabel(story, missing.key)} ≥ ${missing.need} · bạn có ${missing.have}`
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

function renderNode() {
  const node = story.nodes[state.nodeId];
  if (!node) return renderBroken();
  if (isEnding(node)) return renderEnding(node);

  const delta = lastDelta
    .map(([key, d]) => `<span class="chip ${d > 0 ? "up" : "down"}" data-k="${esc(key)}">${esc(statLabel(story, key))} ${d > 0 ? "+" : ""}${d}</span>`)
    .join("");
  lastDelta = [];

  show(`
    <header class="hud">
      <div class="hud-top">
        <span class="brand">&gt; 7_cap_bac</span>
        <span class="step">bước ${pad(state.steps + 1)}</span>
      </div>
      ${levelTrack(node.level)}
      <section class="meters" aria-label="Chỉ số">${statKeys(story).map((key) => meter(key, state.stats[key] ?? 0)).join("")}</section>
      ${nearOverload(story, state.stats) ? `<p class="alert" role="status">${esc(story.meta.overload.warning ?? "")}</p>` : ""}
    </header>
    <main class="scene">
      <p class="kicker">// cấp ${pad(node.level)}/07 · ${esc(levelName(node.level))}</p>
      ${delta ? `<p class="delta" aria-label="Thay đổi chỉ số"><span class="arrow">&gt;</span>${delta}</p>` : ""}
      <h1>${esc(node.title)}</h1>
      <div class="text">${paragraphs(node.text)}</div>
      ${node.fact ? `<aside class="fact"><b>Số liệu theo video</b><p>${esc(node.fact)}</p></aside>` : ""}
      <div class="choices">${(node.choices || []).map(choiceButton).join("")}</div>
    </main>`);
}

function renderEnding(node) {
  const ending = node.ending;
  const done = unlockEnding(state.nodeId);
  const total = allEndings().length;
  clearRun();
  show(`
    <main class="scene ending ${esc(ending.type)}">
      <p class="kicker">// kết thúc · cấp ${pad(node.level)}/07</p>
      <p class="badge ${esc(ending.type)}">${ENDING_LABELS[ending.type] ?? "Kết thúc"}</p>
      <h1>${esc(ending.title)}</h1>
      <div class="text">${paragraphs(node.text)}</div>
      <p class="summary">${esc(ending.summary)}</p>
      <p class="source"><span class="tag">${esc(SOURCE_LABELS[ending.source] ?? "")}</span> ${state.steps} lựa chọn · đã mở ${done.length}/${total} kết</p>
      <div class="finals">${statKeys(story).map((key) => `<span class="pill" data-k="${esc(key)}">${esc(statLabel(story, key))} <b>${state.stats[key] ?? 0}</b></span>`).join("")}</div>
      <div class="actions">
        <button class="btn primary" data-action="start"><kbd>↵</kbd>Chơi lại</button>
        <button class="btn" data-action="library">Thư viện kết</button>
        <button class="btn ghost" data-action="home">Màn hình chính</button>
      </div>
    </main>`);
}

function renderLibrary() {
  const got = new Set(loadEndings());
  const endings = allEndings().sort((a, b) => a.level - b.level);
  show(`
    <main class="scene library">
      <p class="kicker">// thư viện kết</p>
      <h1>${endings.filter((e) => got.has(e.id)).length}/${endings.length} kết đã mở</h1>
      <ul class="cards">
        ${endings
          .map((e) =>
            got.has(e.id)
              ? `<li class="card ${esc(e.type)}">
                  <p class="badge ${esc(e.type)}">${ENDING_LABELS[e.type]}</p>
                  <h2>${esc(e.title)}</h2>
                  <p>${esc(e.summary)}</p>
                  <p class="source"><span class="tag">${esc(SOURCE_LABELS[e.source] ?? "")}</span> cấp ${pad(e.level)}/07</p>
                </li>`
              : `<li class="card locked"><p class="badge">???</p><h2>Chưa mở khóa</h2><p>Chơi tiếp để tìm kết này.</p></li>`,
          )
          .join("")}
      </ul>
      <div class="actions"><button class="btn primary" data-action="home">Về màn hình chính</button></div>
    </main>`);
}

function renderBroken() {
  show(`
    <main class="scene">
      <h1>Dữ liệu truyện không khớp</h1>
      <p class="text">Node hiện tại không còn trong story.json. Hãy bắt đầu lại.</p>
      <div class="actions"><button class="btn primary" data-action="start">Bắt đầu lại</button></div>
    </main>`);
}

function startRun(resume) {
  const run = resume ? loadRun(story) : null;
  state = run ?? createState(story);
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

function act(action) {
  if (action === "start") startRun(false);
  else if (action === "continue") startRun(true);
  else if (action === "library") renderLibrary();
  else if (action === "home") renderTitle();
  else if (action === "reload") location.reload();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-choice]");
  if (!target) return;
  if (target.dataset.choice !== undefined) choose(Number(target.dataset.choice));
  else act(target.dataset.action);
});

// Phím số chọn lựa chọn, Enter bấm nút chính.
document.addEventListener("keydown", (event) => {
  if (!story || event.metaKey || event.ctrlKey || event.altKey) return;
  if (/^[1-9]$/.test(event.key)) {
    app.querySelector(`[data-choice="${Number(event.key) - 1}"]:not([disabled])`)?.click();
  } else if (event.key === "Enter" && document.activeElement?.tagName !== "BUTTON") {
    app.querySelector(".btn.primary")?.click();
  }
});

async function boot() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}story.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    story = await response.json();
  } catch (error) {
    show(`
      <main class="scene">
        <h1>Không tải được story.json</h1>
        <p class="text">${esc(error.message)}</p>
        <div class="actions"><button class="btn primary" data-action="reload">Thử lại</button></div>
      </main>`);
    return;
  }
  renderTitle();
}

boot();
