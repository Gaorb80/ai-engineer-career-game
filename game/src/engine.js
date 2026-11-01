// Luật chơi thuần logic, không đụng vào DOM. Chỉ số lấy hết từ story.stats.
const RUN_KEY = "ai-career-game:v2:run";
const ENDINGS_KEY = "ai-career-game:v2:endings";

export const statKeys = (story) => Object.keys(story.stats);
export const statLabel = (story, key) => story.meta.statLabels?.[key] ?? key;
export const statMax = (story, key) => story.meta.statMax?.[key] ?? 10;

export function createState(story) {
  return { nodeId: story.meta.start, stats: { ...story.stats }, steps: 0 };
}

export const isEnding = (node) => Boolean(node?.ending);

// Yêu cầu chưa đạt đầu tiên, hoặc null nếu chọn được.
export function missingRequirement(choice, stats) {
  for (const [key, need] of Object.entries(choice.requires || {})) {
    const have = stats[key] ?? 0;
    if (have < need) return { key, need, have };
  }
  return null;
}

export function applyChoice(state, choice) {
  const stats = { ...state.stats };
  for (const [key, delta] of Object.entries(choice.effects || {})) {
    if (key in stats) stats[key] += delta;
  }
  return { nodeId: choice.next, stats, steps: state.steps + 1 };
}

// Chênh lệch chỉ số giữa hai trạng thái, bỏ các chỉ số không đổi.
export function diffStats(before, after) {
  return Object.keys(after)
    .map((key) => [key, after[key] - (before[key] ?? 0)])
    .filter(([, d]) => d !== 0);
}

// localStorage có thể bị chặn (chế độ riêng tư): mọi lỗi đều nuốt im lặng.
function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function loadRun(story) {
  const run = read(RUN_KEY);
  if (!run || !story.nodes[run.nodeId] || !run.stats) return null;
  return { nodeId: run.nodeId, stats: { ...story.stats, ...run.stats }, steps: run.steps ?? 0 };
}

export const saveRun = (state) => write(RUN_KEY, state);
export const clearRun = () => write(RUN_KEY, null);

export function loadEndings() {
  const list = read(ENDINGS_KEY);
  return Array.isArray(list) ? list : [];
}

export function unlockEnding(id) {
  const list = loadEndings();
  if (list.includes(id)) return list;
  list.push(id);
  write(ENDINGS_KEY, list);
  return list;
}
