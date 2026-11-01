// Một lệnh để chơi: kiểm tra Node, cài thư viện nếu thiếu, dựng bản chạy, mở trình duyệt.
// Dùng: npm start [-- --no-open] [-- --lan]   (--lan: cho điện thoại cùng Wi-Fi vào chơi)
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const game = fileURLToPath(new URL("../game/", import.meta.url));
const args = process.argv.slice(2);

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 20 || (major === 20 && minor < 19)) {
  console.error(`Node ${process.versions.node} quá cũ. Cần Node 20.19 trở lên: https://nodejs.org (chọn bản LTS).`);
  process.exit(1);
}

function fail(label, status) {
  console.error(`\nBước "${label}" thất bại. Xem lỗi phía trên. Nếu lỗi mạng khi cài thư viện, kiểm tra kết nối rồi chạy lại.`);
  process.exit(status ?? 1);
}

if (!existsSync(join(game, "node_modules"))) {
  console.log("\n> Cài thư viện (chỉ lần đầu, cần mạng)");
  // npm trên Windows là npm.cmd nên cần shell; truyền cả lệnh thành một chuỗi cho khỏi bị cảnh báo.
  const r = spawnSync("npm install --no-audit --no-fund", { cwd: game, stdio: "inherit", shell: true });
  if (r.status !== 0) fail("Cài thư viện", r.status);
}

// Gọi thẳng Vite bằng Node, không qua shell.
const vite = join(game, "node_modules", "vite", "bin", "vite.js");
const runVite = (...a) => ({ cwd: game, stdio: "inherit", args: [vite, ...a] });

console.log("\n> Dựng game");
const b = runVite("build");
const built = spawnSync(process.execPath, b.args, { cwd: b.cwd, stdio: b.stdio });
if (built.status !== 0) fail("Dựng game", built.status);

console.log("\n> Mở game. Nhấn Ctrl+C để dừng.\n");
const serve = ["preview", "--port", "4173", "--strictPort"];
if (!args.includes("--no-open")) serve.push("--open");
if (args.includes("--lan")) serve.push("--host");
const p = runVite(...serve);
const server = spawn(process.execPath, p.args, { cwd: p.cwd, stdio: p.stdio });
server.on("exit", (code) => process.exit(code ?? 0));
