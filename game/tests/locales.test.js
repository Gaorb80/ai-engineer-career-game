import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const vi = JSON.parse(readFileSync(join(root, "public/story.vi.json"), "utf8"));

// Dựng thư mục tạm có story.vi.json và một bản en do hàm mutate chỉnh từ bản vi.
function check(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "locales-"));
  const en = structuredClone(vi);
  mutate(en);
  writeFileSync(join(dir, "story.vi.json"), JSON.stringify(vi));
  writeFileSync(join(dir, "story.en.json"), JSON.stringify(en));
  return spawnSync(process.execPath, ["scripts/validate-locales.js", dir], { cwd: root, encoding: "utf8" });
}

test("hai bản ngôn ngữ giống cấu trúc thì hợp lệ", () => {
  const r = check(() => {});
  assert.equal(r.status, 0, r.stderr);
});

test("lệch next của một lựa chọn bị từ chối", () => {
  const r = check((en) => {
    en.nodes.start.choices[0].next = "l2-tin";
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /nodes\.start\.choices\[0\] khác next/);
});

test("thiếu node, lệch effects và mất placeholder đều bị bắt", () => {
  const r = check((en) => {
    delete en.nodes["l1-hoc"];
    en.nodes.start.choices[1].effects = { skill: 99 };
    en.meta.ui.continue = "Continue";
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /khác danh sách id node/);
  assert.match(r.stderr, /khác effects/);
  assert.match(r.stderr, /meta\.ui\.continue placeholder lệch/);
});
