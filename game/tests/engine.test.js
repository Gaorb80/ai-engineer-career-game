import test from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  missingRequirement,
  applyChoice,
  diffStats,
  resolveOverload,
  nearOverload,
  statKeys,
  statLabel,
  statMax,
  loadRun,
  saveRun,
  clearRun,
  loadEndings,
  unlockEnding,
} from "../src/engine.js";

const story = {
  meta: { start: "start", statLabels: { skill: "Kỹ năng" }, statMax: { skill: 20 } },
  stats: { skill: 2, money: 3, stress: 0 },
  nodes: { start: {}, giua: {} },
};

function fakeStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function brokenStorage() {
  const fail = () => {
    throw new Error("storage bị chặn");
  };
  globalThis.localStorage = { getItem: fail, setItem: fail, removeItem: fail };
}

test("chỉ số lấy từ story.stats, nhãn và trần có mặc định", () => {
  assert.deepEqual(statKeys(story), ["skill", "money", "stress"]);
  assert.equal(statLabel(story, "skill"), "Kỹ năng");
  assert.equal(statLabel(story, "money"), "money");
  assert.equal(statMax(story, "skill"), 20);
  assert.equal(statMax(story, "money"), 10);
});

test("createState lấy node start và bản sao stats", () => {
  const state = createState(story);
  assert.equal(state.nodeId, "start");
  assert.deepEqual(state.stats, story.stats);
  state.stats.skill = 99;
  assert.equal(story.stats.skill, 2);
});

test("missingRequirement trả yêu cầu chưa đạt đầu tiên", () => {
  assert.equal(missingRequirement({}, { skill: 0 }), null);
  assert.deepEqual(missingRequirement({ requires: { skill: 5 } }, { skill: 2 }), { key: "skill", need: 5, have: 2 });
  assert.equal(missingRequirement({ requires: { skill: 2 } }, { skill: 2 }), null);
  assert.deepEqual(missingRequirement({ requires: { network: 3 } }, {}), { key: "network", need: 3, have: 0 });
});

test("applyChoice cộng điểm, cho phép âm, bỏ key lạ, không sửa state gốc", () => {
  const state = createState(story);
  const next = applyChoice(state, { next: "giua", effects: { skill: 3, money: -5, "khong-ai": 10 } });
  assert.equal(next.nodeId, "giua");
  assert.equal(next.steps, 1);
  assert.deepEqual(next.stats, { skill: 5, money: -2, stress: 0 });
  assert.equal(state.stats.skill, 2);
});

test("diffStats chỉ trả chỉ số có thay đổi", () => {
  assert.deepEqual(diffStats({ a: 1, b: 2 }, { a: 3, b: 2 }), [["a", 2]]);
});

test("lưu lượt chơi, xóa khi tới kết nhưng giữ danh sách kết đã mở", () => {
  fakeStorage();
  const state = { ...createState(story), nodeId: "giua", steps: 4 };
  assert.equal(saveRun(state), true);
  assert.deepEqual(loadRun(story), state);

  unlockEnding("ket-a");
  assert.deepEqual(unlockEnding("ket-a"), ["ket-a"]);
  clearRun();
  assert.equal(loadRun(story), null);
  assert.deepEqual(loadEndings(), ["ket-a"]);
});

test("loadRun bỏ qua save trỏ vào node không còn tồn tại", () => {
  fakeStorage();
  saveRun({ nodeId: "da-xoa", stats: {}, steps: 1 });
  assert.equal(loadRun(story), null);
});

test("localStorage ném lỗi thì đọc trả rỗng, ghi trả false, không văng", () => {
  brokenStorage();
  assert.equal(loadRun(story), null);
  assert.deepEqual(loadEndings(), []);
  assert.equal(saveRun(createState(story)), false);
  assert.doesNotThrow(() => clearRun());
});

test("resolveOverload ép sang kết khi chỉ số chạm ngưỡng, trừ khi đã tới kết", () => {
  const s = {
    meta: { overload: { stat: "stress", at: 10, next: "ket-x" } },
    nodes: { a: {}, "ket-x": { ending: {} }, "ket-y": { ending: {} } },
  };
  assert.equal(resolveOverload(s, { nodeId: "a", stats: { stress: 9 } }).nodeId, "a");
  assert.equal(resolveOverload(s, { nodeId: "a", stats: { stress: 10 } }).nodeId, "ket-x");
  assert.equal(resolveOverload(s, { nodeId: "ket-y", stats: { stress: 12 } }).nodeId, "ket-y");
  assert.equal(nearOverload(s, { stress: 8 }), true);
  assert.equal(nearOverload(s, { stress: 7 }), false);
});
