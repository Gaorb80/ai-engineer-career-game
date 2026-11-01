import os
import re
import sys
import subprocess
from concurrent.futures import ThreadPoolExecutor

VIDEO_PATH = r"C:\Users\Duong_Bao\Downloads\7 Cấp Bậc Thăng Tiến Kỹ Sư AI - Lương chạm 650 triệu_.mp4"
FRAMES_DIR = r"story/frames"
SHEETS_DIR = r"story/sheets"
DURATION = 1043.96

def get_scene_timestamps():
    scenes = []
    if os.path.exists("story/scenes.txt"):
        with open("story/scenes.txt", "r", encoding="utf-8") as f:
            text = f.read()
            for m in re.finditer(r'pts_time:([0-9.]+)\s+lavfi\.scene_score=([0-9.]+)', text):
                t = float(m.group(1))
                s = float(m.group(2))
                scenes.append((t, s))
    return scenes

def select_timestamps(scenes, target_count=108):
    # Select target_count timestamps evenly distributed, snapping to scene changes
    # Ensure min gap >= 6.0s and max gap <= 10.0s
    selected = [0.0]
    curr = 0.0
    for i in range(1, target_count):
        target_t = (i / (target_count - 1)) * (DURATION - 3.0)
        # Search for a scene change close to target_t within [target_t - 2.5, target_t + 2.5]
        candidates = [s for s in scenes if abs(s[0] - target_t) <= 2.5 and s[0] > curr + 6.0]
        if candidates:
            best = max(candidates, key=lambda x: x[1])
            curr = best[0] + 0.3
        else:
            curr = target_t
        # Ensure max gap <= 10.0s from last
        if curr - selected[-1] > 10.0:
            curr = selected[-1] + 10.0
        # Ensure min gap >= 5.0s
        if curr - selected[-1] < 5.0:
            curr = selected[-1] + 5.0
        selected.append(min(curr, DURATION - 1.0))
        curr = selected[-1]
    
    # Format to unique mm:ss
    unique_items = []
    seen = set()
    for t in selected:
        sec = int(round(t))
        if sec in seen:
            sec += 1
        seen.add(sec)
        unique_items.append((sec, t))
        
    return unique_items

def extract_frame(item):
    sec, t = item
    mm = sec // 60
    ss = sec % 60
    fname = f"f_{mm:02d}{ss:02d}.jpg"
    out_path = os.path.join(FRAMES_DIR, fname)
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{t:.2f}",
        "-i", VIDEO_PATH,
        "-frames:v", "1",
        "-update", "1",
        "-vf", "scale=960:-1",
        "-q:v", "4",
        out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return fname, f"{mm:02d}:{ss:02d}", out_path

def create_sheet(sheet_idx, batch):
    sheet_name = f"sheet_{sheet_idx:02d}.jpg"
    sheet_path = os.path.join(SHEETS_DIR, sheet_name)
    
    cmd = ["ffmpeg", "-y"]
    filter_parts = []
    concat_inputs = []
    
    for idx, (fname, ts, path) in enumerate(batch):
        cmd.extend(["-i", path])
        # Escape colon in timestamp for ffmpeg drawtext
        esc_ts = ts.replace(":", r"\:")
        draw = (
            f"[{idx}:v]drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':"
            f"text='{esc_ts}':fontsize=36:fontcolor=white:box=1:"
            f"boxcolor=black@0.6:boxborderw=6:x=20:y=20[v{idx}]"
        )
        filter_parts.append(draw)
        concat_inputs.append(f"[v{idx}]")
        
    n = len(batch)
    filter_complex = ";".join(filter_parts) + ";" + "".join(concat_inputs) + f"concat=n={n}:v=1:a=0,tile=3x3"
    cmd.extend(["-filter_complex", filter_complex, "-update", "1", "-q:v", "3", sheet_path])
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"Created {sheet_name} with {n} tiles", flush=True)

def main():
    os.makedirs(FRAMES_DIR, exist_ok=True)
    os.makedirs(SHEETS_DIR, exist_ok=True)
    
    scenes = get_scene_timestamps()
    items = select_timestamps(scenes, target_count=108)
    print(f"Selected {len(items)} frame timestamps. Extracting frames...", flush=True)
    
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(extract_frame, items))
        
    print(f"Extracted {len(results)} frames. Sorting by timestamp...", flush=True)
    results.sort(key=lambda x: x[0])
    
    print(f"Generating contact sheets (3x3 grid)...", flush=True)
    for sheet_idx, i in enumerate(range(0, len(results), 9), start=1):
        batch = results[i:i+9]
        create_sheet(sheet_idx, batch)
        
    print("Done frame extraction and contact sheets!", flush=True)

if __name__ == "__main__":
    main()
