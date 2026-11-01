// Luật chơi thuần logic, không đụng vào DOM.
export const STAT_KEYS = ["skill", "money", "stress", "network"];
export const STAT_LABELS = {
  skill: "Kỹ năng",
  money: "Tiền",
  stress: "Căng thẳng",
  network: "Quan hệ",
};

const STORAGE_KEY = "ai-career-game:v1";

export function createState(story) {
  const stats = { skill: 0, money: 0, stress: 0, network: 0 };
  for (const key of STAT_KEYS) {
    if (typeof story.stats?.[key] === "number") stats[key] = story.stats[key];
  }
  return { nodeId: story.meta.start, stats, unlocked: [] };
}

export function isEnding(node) {
  return Boolean(node && node.ending);
}

// Trả về yêu cầu chưa đạt đầu tiên, hoặc null nếu chọn được.
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
    if (key in stats) stats[key] = Math.max(0, stats[key] + delta);
  }
  return { ...state, stats, nodeId: choice.next };
}

export function unlockEnding(state, endingId) {
  if (state.unlocked.includes(endingId)) return state;
  return { ...state, unlocked: [...state.unlocked, endingId] };
}

// localStorage có thể bị chặn (chế độ riêng tư) — mọi lỗi đều nuốt im lặng.
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : null;
    if (!saved || typeof saved.nodeId !== "string" || !saved.stats) return null;
    return { nodeId: saved.nodeId, stats: saved.stats, unlocked: saved.unlocked || [] };
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // không lưu được thì thôi
  }
}
