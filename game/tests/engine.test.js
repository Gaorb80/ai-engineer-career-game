import test from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  missingRequirement,
  applyChoice,
  unlockEnding,
  loadState,
  loadUnlocked,
  saveState,
  clearState,
} from "../src/engine.js";

const story = { meta: { start: "start" }, stats: { skill: 2, money: 3, stress: 0, network: 1 } };

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  globalThis.localStorage = {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
  return data;
}

function brokenStorage() {
  const fail = () => {
    throw new Error("storage bị chặn");
  };
  globalThis.localStorage = { getItem: fail, setItem: fail, removeItem: fail };
}

test("createState lấy node start và stats từ story", () => {
  const state = createState(story);
  assert.equal(state.nodeId, "start");
  assert.deepEqual(state.stats, { skill: 2, money: 3, stress: 0, network: 1 });
  assert.deepEqual(state.unlocked, []);
});

test("missingRequirement trả yêu cầu chưa đạt đầu tiên", () => {
  assert.equal(missingRequirement({}, { skill: 0 }), null);
  assert.deepEqual(missingRequirement({ requires: { skill: 5 } }, { skill: 2 }), {
    key: "skill",
    need: 5,
    have: 2,
  });
  assert.equal(missingRequirement({ requires: { skill: 2 } }, { skill: 2 }), null);
  assert.deepEqual(missingRequirement({ requires: { network: 3 } }, {}), { key: "network", need: 3, have: 0 });
});

test("applyChoice cộng điểm, cho phép âm và bỏ qua key lạ", () => {
  const state = createState(story);
  const next = applyChoice(state, {
    next: "node-2",
    effects: { skill: 3, money: -5, stress: -1, "khong-ai": 10 },
  });

  assert.equal(next.nodeId, "node-2");
  assert.deepEqual(next.stats, { skill: 5, money: -2, stress: -1, network: 1 });
  assert.equal("khong-ai" in next.stats, false);
  // state gốc không bị sửa.
  assert.equal(state.stats.skill, 2);
});

test("unlockEnding không thêm trùng", () => {
  const state = createState(story);
  const once = unlockEnding(state, "ket-ic");
  const twice = unlockEnding(once, "ket-ic");
  assert.deepEqual(once.unlocked, ["ket-ic"]);
  assert.equal(twice, once);
});

test("saveState/loadState lưu lượt chơi, clearState giữ kết đã mở", () => {
  fakeStorage();
  const state = { ...createState(story), nodeId: "giua" };
  assert.equal(saveState(state), true);
  assert.deepEqual(loadState(), state);

  clearState();
  assert.equal(loadState(), null);

  const ended = unlockEnding(state, "ket-ic");
  assert.equal(saveState(ended), true);
  clearState();
  assert.equal(loadState(), null);
  assert.deepEqual(loadUnlocked(), ["ket-ic"]);
});

test("loadState/loadUnlocked trả rỗng và saveState trả false khi localStorage ném lỗi", () => {
  brokenStorage();
  assert.equal(loadState(), null);
  assert.deepEqual(loadUnlocked(), []);
  assert.equal(saveState(createState(story)), false);
  assert.doesNotThrow(() => clearState());
});
