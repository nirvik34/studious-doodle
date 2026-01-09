import cv2
import os
from pathlib import Path
from tqdm import tqdm

INPUT_DIR = "data/raw_videos/depvidmood"
OUTPUT_DIR = "data/processed/clips"

CLIP_SECONDS = 3
TARGET_FPS = 10

os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_clips(video_path):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps == 0:
        cap.release()
        return 0

    frame_gap = max(1, int(fps / TARGET_FPS))
    frames_per_clip = CLIP_SECONDS * TARGET_FPS

    frames = []
    frame_idx = 0
    clip_idx = 0
    saved = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_gap == 0:
            frames.append(frame)

        if len(frames) == frames_per_clip:
            h, w, _ = frames[0].shape
            clip_name = f"{Path(video_path).stem}_c{clip_idx}.mp4"
            clip_path = os.path.join(OUTPUT_DIR, clip_name)

            writer = cv2.VideoWriter(
                clip_path,
                cv2.VideoWriter_fourcc(*"mp4v"),
                TARGET_FPS,
                (w, h)
            )

            for f in frames:
                writer.write(f)
            writer.release()

            frames = []
            clip_idx += 1
            saved += 1

        frame_idx += 1

    cap.release()
    return saved

def main():
    total_clips = 0

    for root, _, files in os.walk(INPUT_DIR):
        for file in files:
            if file.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
                path = os.path.join(root, file)
                total_clips += extract_clips(path)

    print("Total clips generated:", total_clips)

if __name__ == "__main__":
    main()
