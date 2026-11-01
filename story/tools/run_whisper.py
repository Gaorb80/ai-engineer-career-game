import os
import sys
import wave

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import numpy as np
from faster_whisper import WhisperModel

def format_timestamp(seconds: float) -> str:
    mins = int(seconds // 60)
    secs = int(seconds % 60)
    return f"[{mins:02d}:{secs:02d}]"

def load_audio(wav_path: str) -> np.ndarray:
    with wave.open(wav_path, "rb") as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        data = wf.readframes(n_frames)
        
    print(f"Audio: {n_channels} ch, {framerate} Hz, {n_frames} frames", flush=True)
    audio = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
    return audio

def main():
    audio_path = "story/audio.wav"
    output_path = "story/transcript.md"
    
    print(f"Reading audio from {audio_path}...", flush=True)
    audio_data = load_audio(audio_path)
    
    threads = min(8, os.cpu_count() or 4)
    print(f"Loading Whisper model (small, cpu, int8, {threads} threads)...", flush=True)
    model = WhisperModel("small", device="cpu", compute_type="int8", cpu_threads=threads)
        
    print(f"Transcribing audio...", flush=True)
    segments, info = model.transcribe(
        audio_data,
        language="vi",
        beam_size=5,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500)
    )
    
    print(f"Detected language '{info.language}' with probability {info.language_probability:.2f}", flush=True)
    
    lines = ["# Bản Chép Lời: 7 Cấp Bậc Thăng Tiến Kỹ Sư AI - Lương chạm 650 triệu\n"]
    count = 0
    for segment in segments:
        ts = format_timestamp(segment.start)
        text = segment.text.strip()
        lines.append(f"{ts} {text}")
        count += 1
        if count % 20 == 0:
            print(f"[{count}] {ts} {text[:40]}...", flush=True)
            
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n\n".join(lines) + "\n")
        
    print(f"Done! Written {count} segments to {output_path}", flush=True)

if __name__ == "__main__":
    main()
