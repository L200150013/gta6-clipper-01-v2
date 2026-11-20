// gta6-clipper-01 — entry program (Node 22, standard library only).
//
// The entry is a public YouTube Short of a GTA 6 launch-day clip, cut by an
// AI agent from the Game*Spark PS5 opening footage (19 Nov 2026): Lucia and
// Jason key art hooks the viewer, a fast Vice City montage follows, then the
// clip pitches make.fun — "make clips with AI and earn money on make.fun" —
// and closes on a make.fun end card for the $500 GTA 6 Clipper bounty.
//
// This program does the one thing the bounty asks of it: it reads VIDEO.json
// from the repository root, validates that it names an https YouTube video
// address, and copies it into the output directory for the grader. The house
// reads the video itself through the YouTube Data API; nothing written here
// about the video counts toward the score.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const videoPath = join(repoRoot, "VIDEO.json");

// Read and validate the video link before touching the output directory.
const raw = readFileSync(videoPath, "utf8");
const video = JSON.parse(raw) as { url?: unknown };
if (typeof video.url !== "string" || !video.url.startsWith("https://")) {
  throw new Error("VIDEO.json must hold an https url string");
}
const youTube = /^(?:https:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]{11}/;
if (video.url.length > 2048 || !youTube.test(video.url)) {
  throw new Error(`VIDEO.json url is not a YouTube video address: ${video.url}`);
}
// The 2048 cap mirrors the gate's own url length limit, so a link that
// passes here cannot be refused for length alone.

// Prepare the output directory: create it if missing, then empty only its
// contents, entry by entry. The output directory itself is a mount point on
// the grader, so it is never removed — only what is inside it is cleared.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

copyFileSync(videoPath, join(outDir, "VIDEO.json"));
console.log(`gta6-clipper-01: wrote VIDEO.json to ${outDir} (${video.url})`);
