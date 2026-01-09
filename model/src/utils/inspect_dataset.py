import os

BASE_DIR = "data/raw_videos/depvidmood"

video_count = 0
actor_map = {}

for actor in os.listdir(BASE_DIR):
    actor_path = os.path.join(BASE_DIR, actor)
    if not os.path.isdir(actor_path):
        continue

    count = 0
    for root, _, files in os.walk(actor_path):
        for f in files:
            if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv")):
                count += 1

    actor_map[actor] = count
    video_count += count

print("Actors found:", len(actor_map))
print("Total video files:", video_count)

for k, v in actor_map.items():
    print(f"{k}: {v}")
