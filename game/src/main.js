import "./style.css";
import {
  STAT_KEYS,
  STAT_LABELS,
  createState,
  isEnding,
  missingRequirement,
  applyChoice,
  unlockEnding,
  loadState,
  loadUnlocked,
  saveState,
  clearState,
} from "./engine.js";

const ENDING_LABELS = { good: "Kết tốt", bad: "Kết xấu", neutral: "Kết trung lập" };
const SOURCE_LABELS = { video: "Nguồn: video gốc", extended: "Nội dung mở rộng" };

const app = document.getElementById("app");
let story = null;
let state = null;
let saved = loadState();
let storageBlocked = false;

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

function imageSrc(path) {
  return String(path).replace(/^\/+/, "");
}

function allEndings() {
  return Object.entries(story.nodes)
    .filter(([, node]) => isEnding(node))
    .map(([id, node]) => ({ id, level: node.level, ...node.ending }));
}

function unlockedSet() {
  return new Set(state?.unlocked ?? saved?.unlocked ?? loadUnlocked());
}

function persist() {
  const finished = isEnding(story.nodes[state.nodeId]);
  saved = finished ? null : state;
  if (!saveState(state)) storageBlocked = true;
  if (finished) clearState();
}

function renderTitle() {
  const endings = allEndings();
  const unlocked = unlockedSet();
  const unlockedCount = endings.filter((ending) => unlocked.has(ending.id)).length;
  const canContinue = Boolean(saved && story.nodes[saved.nodeId]);
  const continueLevel = canContinue ? story.nodes[saved.nodeId].level : 0;

  app.innerHTML = `
    <main class="screen title">
      <p class="eyebrow">Game chọn lựa · 7 cấp bậc</p>
      <h1>${esc(story.meta.title)}</h1>
      <p class="lede">Bảy cấp bậc, một con đường. Mỗi lựa chọn đổi chỉ số và mở ra nhánh khác.</p>
      <div class="actions">
        ${canContinue ? `<button class="btn primary" data-action="continue">Tiếp tục · Cấp ${continueLevel}/7</button>` : ""}
        <button class="btn ${canContinue ? "" : "primary"}" data-action="start">${canContinue ? "Chơi lại từ đầu" : "Bắt đầu"}</button>
        <button class="btn ghost" data-action="library">Thư viện kết · ${unlockedCount}/${endings.length}</button>
      </div>
      ${
        storageBlocked
          ? `<p class="hint warn">Trình duyệt chặn lưu trữ — tiến trình sẽ mất khi tải lại trang.</p>`
          : `<p class="hint">Tiến trình tự lưu trên thiết bị này.</p>`
      }
    </main>`;
  window.scrollTo(0, 0);
}

function statBar(key, value, cap) {
  const pct = Math.min(100, Math.max(0, (value / cap) * 100));
  return `
    <div class="stat ${key}">
      <div class="stat-head"><span>${STAT_LABELS[key]}</span><b>${value}</b></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
    </div>`;
}

function choiceButton(choice, index) {
  const missing = missingRequirement(choice, state.stats);
  const effects = Object.entries(choice.effects || {})
    .map(([key, delta]) => `${delta > 0 ? "+" : ""}${delta} ${STAT_LABELS[key]}`)
    .join(" · ");
  const meta = missing
    ? `Cần ${STAT_LABELS[missing.key]} ≥ ${missing.need} · bạn có ${missing.have}`
    : story.meta.showEffects === true
      ? effects
      : "";

  return `
    <button class="btn choice ${missing ? "locked" : ""}" data-choice="${index}" ${missing ? "disabled" : ""}>
      <span class="choice-label">${esc(choice.label)}</span>
      ${meta ? `<span class="choice-meta">${esc(meta)}</span>` : ""}
    </button>`;
}

function renderNode() {
  const node = story.nodes[state.nodeId];
  if (!node) return renderBroken();

  if (isEnding(node)) {
    state = unlockEnding(state, state.nodeId);
    persist();
    return renderEnding(node);
  }

  const cap = Math.max(10, ...STAT_KEYS.map((key) => state.stats[key] || 0));

  app.innerHTML = `
    <header class="hud">
      <div class="hud-top">
        <span class="rank">Cấp <b>${node.level}</b><span class="muted">/7</span></span>
      </div>
      <ol class="levels" aria-label="Tiến trình cấp bậc">
        ${[1, 2, 3, 4, 5, 6, 7]
          .map(
            (n) =>
              `<li class="${n <= node.level ? "on" : ""}" ${n === node.level ? 'aria-current="step"' : ""}><span>${n}</span></li>`,
          )
          .join("")}
      </ol>
      <section class="stats" aria-label="Chỉ số">
        ${STAT_KEYS.map((key) => statBar(key, state.stats[key] || 0, cap)).join("")}
      </section>
    </header>
    <main class="scene">
      <h1>${esc(node.title)}</h1>
      ${node.image ? `<img class="scene-img" src="${esc(imageSrc(node.image))}" alt="" loading="lazy" />` : ""}
      <div class="text">${paragraphs(node.text)}</div>
      <div class="choices">
        ${(node.choices || []).map(choiceButton).join("")}
      </div>
    </main>`;
  window.scrollTo(0, 0);
}

function renderEnding(node) {
  const ending = node.ending;
  const endings = allEndings();
  const unlocked = unlockedSet();

  app.innerHTML = `
    <main class="scene ending">
      <p class="badge ${esc(ending.type)}">${ENDING_LABELS[ending.type] || "Kết thúc"}</p>
      <h1>${esc(ending.title)}</h1>
      <div class="text">${paragraphs(node.text)}</div>
      <p class="ending-summary">${esc(ending.summary)}</p>
      <p class="source">${esc(SOURCE_LABELS[ending.source] || "Nguồn không xác định")} · Cấp ${node.level}/7</p>
      <div class="final-stats">
        ${STAT_KEYS.map(
          (key) => `<span class="pill">${STAT_LABELS[key]} <b>${state.stats[key] || 0}</b></span>`,
        ).join("")}
      </div>
      <div class="actions">
        <button class="btn primary" data-action="replay">Chơi lại</button>
        <button class="btn" data-action="library">Thư viện kết · ${endings.filter((e) => unlocked.has(e.id)).length}/${endings.length}</button>
        <button class="btn ghost" data-action="home">Màn hình chính</button>
      </div>
    </main>`;
  window.scrollTo(0, 0);
}

function renderLibrary() {
  const unlocked = unlockedSet();
  const endings = allEndings();
  const unlockedCount = endings.filter((ending) => unlocked.has(ending.id)).length;

  app.innerHTML = `
    <main class="scene library">
      <p class="eyebrow">Thư viện kết</p>
      <h1>${unlockedCount}/${endings.length} kết đã mở</h1>
      <ul class="ending-list">
        ${endings
          .map((ending) =>
            unlocked.has(ending.id)
              ? `<li class="ending-item ${esc(ending.type)}">
                  <p class="badge ${esc(ending.type)}">${ENDING_LABELS[ending.type]}</p>
                  <h2>${esc(ending.title)}</h2>
                  <p class="text small">${esc(ending.summary)}</p>
                  <p class="source">${esc(SOURCE_LABELS[ending.source] || "")} · Cấp ${ending.level}/7</p>
                </li>`
              : `<li class="ending-item locked">
                  <h2>Chưa mở khóa</h2>
                  <p class="muted">Chơi tiếp để mở kết này.</p>
                </li>`,
          )
          .join("")}
      </ul>
      <div class="actions">
        <button class="btn primary" data-action="home">Về màn hình chính</button>
      </div>
    </main>`;
  window.scrollTo(0, 0);
}

function renderBroken() {
  app.innerHTML = `
    <main class="screen">
      <h1>Dữ liệu truyện không khớp</h1>
      <p class="text">Node hiện tại không còn trong story.json. Hãy bắt đầu lại.</p>
      <div class="actions">
        <button class="btn primary" data-action="start">Bắt đầu lại</button>
      </div>
    </main>`;
}

function startRun(continueSaved) {
  const keptUnlocked = state?.unlocked ?? saved?.unlocked ?? loadUnlocked();
  if (continueSaved && saved && story.nodes[saved.nodeId]) {
    state = { nodeId: saved.nodeId, stats: { ...saved.stats }, unlocked: [...keptUnlocked] };
  } else {
    state = createState(story);
    state.unlocked = [...new Set(keptUnlocked)];
  }
  persist();
  renderNode();
}

function goToNode(id) {
  if (!story.nodes[id]) return renderBroken();
  state = { ...state, nodeId: id };
  persist();
  renderNode();
}

function choose(index) {
  const node = story.nodes[state.nodeId];
  const choice = node?.choices?.[index];
  if (!choice || missingRequirement(choice, state.stats)) return;
  state = applyChoice(state, choice);
  goToNode(state.nodeId);
}

function onClick(event) {
  const target = event.target.closest("[data-action], [data-choice]");
  if (!target) return;

  if (target.dataset.choice !== undefined) {
    choose(Number(target.dataset.choice));
    return;
  }

  switch (target.dataset.action) {
    case "start":
    case "replay":
      startRun(false);
      break;
    case "continue":
      startRun(true);
      break;
    case "library":
      renderLibrary();
      break;
    case "home":
      renderTitle();
      break;
    case "reload":
      location.reload();
      break;
  }
}

async function boot() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}story.json`, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    story = await response.json();
  } catch (error) {
    app.innerHTML = `
      <main class="screen">
        <h1>Không tải được story.json</h1>
        <p class="text">${esc(error.message)}</p>
        <div class="actions"><button class="btn primary" data-action="reload">Thử lại</button></div>
      </main>`;
    return;
  }

  // Save cũ trỏ tới màn kết hoặc node đã mất thì bỏ qua lượt chơi đó.
  if (saved && !story.nodes[saved.nodeId]) saved = null;
  if (saved && isEnding(story.nodes[saved.nodeId])) saved = null;
  app.addEventListener("click", onClick);
  renderTitle();
}

boot();
