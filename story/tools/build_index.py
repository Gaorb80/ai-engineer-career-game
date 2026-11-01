import os
import re
import asyncio
from winsdk.windows.storage import StorageFile
from winsdk.windows.graphics.imaging import BitmapDecoder
from winsdk.windows.media.ocr import OcrEngine

FRAMES_DIR = "story/frames"
TRANSCRIPT_PATH = "story/transcript.md"
INDEX_PATH = "story/frames/INDEX.md"

def load_transcript():
    transcript = []
    if os.path.exists(TRANSCRIPT_PATH):
        with open(TRANSCRIPT_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                m = re.match(r'\[(\d{2}):(\d{2})\]\s*(.+)', line)
                if m:
                    mins = int(m.group(1))
                    secs = int(m.group(2))
                    total_sec = mins * 60 + secs
                    transcript.append((total_sec, f"{mins:02d}:{secs:02d}", m.group(3)))
    return transcript

def get_transcript_context(ts_sec, transcript):
    # Find transcript line closest to ts_sec but <= ts_sec or within a small window
    best = ""
    for sec, ts_str, text in transcript:
        if sec <= ts_sec:
            best = text
        else:
            if not best:
                best = text
            break
    return best

async def ocr_frame(engine, filepath):
    try:
        p = os.path.abspath(filepath)
        file = await StorageFile.get_file_from_path_async(p)
        stream = await file.open_async(1)
        decoder = await BitmapDecoder.create_async(stream)
        bitmap = await decoder.get_software_bitmap_async()
        res = await engine.recognize_async(bitmap)
        raw = " ".join(res.text.split())
        return raw
    except Exception as e:
        return ""

def clean_ocr(text):
    # Filter out common garbage characters or short artifacts
    words = [w for w in text.split() if len(w) > 1]
    cleaned = " ".join(words)
    return cleaned

async def main():
    transcript = load_transcript()
    engine = OcrEngine.try_create_from_user_profile_languages()
    
    files = [f for f in os.listdir(FRAMES_DIR) if f.startswith("f_") and f.endswith(".jpg")]
    files.sort()
    
    print(f"Processing {len(files)} frames for INDEX.md...", flush=True)
    
    rows = []
    for f in files:
        m = re.match(r'f_(\d{2})(\d{2})\.jpg', f)
        if not m:
            continue
        mm = int(m.group(1))
        ss = int(m.group(2))
        ts_sec = mm * 60 + ss
        ts_str = f"{mm:02d}:{ss:02d}"
        
        filepath = os.path.join(FRAMES_DIR, f)
        ocr_text = await ocr_frame(engine, filepath)
        ocr_clean = clean_ocr(ocr_text)
        spoken = get_transcript_context(ts_sec, transcript)
        
        # Build 1-line description
        # If OCR text is meaningful (contains keywords like Level, Lương, AI, Python, etc.)
        desc = ""
        if len(ocr_clean) > 8:
            # Truncate if too long
            short_ocr = ocr_clean[:70]
            desc = f"Slide: \"{short_ocr}\" — {spoken[:60]}"
        else:
            desc = f"Cảnh/minh họa — {spoken[:90]}"
            
        desc = desc.replace("|", "/")  # Avoid breaking markdown table
        rows.append((f, ts_str, desc, ocr_clean, spoken))
        
    # Write INDEX.md
    with open(INDEX_PATH, "w", encoding="utf-8") as out:
        out.write("# Chỉ Mục Khung Hình (Frames Index)\n\n")
        out.write(f"Tổng số khung hình: {len(rows)}\n\n")
        out.write("| Khung hình | Mốc thời gian | Mô tả (Chữ trên slide / Nội dung) |\n")
        out.write("| :--- | :---: | :--- |\n")
        for f, ts_str, desc, _, _ in rows:
            out.write(f"| `{f}` | [{ts_str}] | {desc} |\n")
            
    print(f"Written {len(rows)} entries to {INDEX_PATH}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
