import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

function validate(fixture) {
  const args = ["scripts/validate.js", ...(fixture ? [`tests/fixtures/${fixture}`] : [])];
  return spawnSync(process.execPath, args, { cwd: root, encoding: "utf8" });
}

test("validator chấp nhận story.json mẫu", () => {
  const result = validate();
  assert.equal(result.status, 0, result.stderr);
});

test("validator chấp nhận fixture hợp lệ", () => {
  const result = validate("valid.json");
  assert.equal(result.status, 0, result.stderr);
});

test("validator từ chối fixture softlock và chỉ rõ node", () => {
  const result = validate("softlock.json");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /nodes\.bi-ket: phải có ít nhất một lựa chọn không có requires/);
  assert.match(result.stderr, /nodes\.vong-lap: không có đường tới kết nào/);
});
