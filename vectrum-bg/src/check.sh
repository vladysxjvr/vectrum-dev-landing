#!/usr/bin/env bash
# Loop + banding checks for each rendered MP4.
#  1. SSIM frame 0 vs frame 300 (p=1.0 rendered separately; must be ~1.0)
#  2. Video concatenated with itself 3x: SSIM between consecutive frames;
#     seam pairs (299->300, 599->600) must look like any ordinary neighbour pair.
#     Measured twice: raw (grain changes every frame) and with grain blurred away (motion only).
#  3. Banding on the dark gradient (top-left safe zone, decoded MP4 frame 0):
#     longest horizontal run of identical luma values (banding => long flat runs)
#     and the largest step of the column-averaged luma profile.
set -euo pipefail
cd "$(dirname "$0")/.."
HERE=$(pwd)/src
TMP=$(mktemp -d)
for d in renders/*/; do
  id=$(basename "$d"); mp4="$d$id.mp4"
  [ -f "$d$id-frame300.png" ] || { echo "$id: not finished, skipped"; continue; }  # frame300 is written last
  # 1
  s0300=$(ffmpeg -hide_banner -i "$d$id-frame0.png" -i "$d$id-frame300.png" -lavfi ssim -f null - 2>&1 | grep -oE 'All:[0-9.]+' | cut -d: -f2)
  # 2
  printf "file '%s'\nfile '%s'\nfile '%s'\n" "$PWD/$mp4" "$PWD/$mp4" "$PWD/$mp4" > "$TMP/list.txt"
  ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/x3.mp4"
  for mode in raw blur; do
    f=""; [ $mode = blur ] && f=",gblur=sigma=3"
    ffmpeg -hide_banner -loglevel error -i "$TMP/x3.mp4" -i "$TMP/x3.mp4" \
      -lavfi "[0]trim=start_frame=1,setpts=PTS-STARTPTS$f[a];[1]setpts=PTS-STARTPTS$f[b];[a][b]ssim=stats_file=$TMP/ssim_$mode.txt" -f null - 2>/dev/null
  done
  # 3
  ffmpeg -hide_banner -loglevel error -y -i "$mp4" -vf "select=eq(n\,0),crop=500:420:0:0,format=gray" -frames:v 1 -f rawvideo "$TMP/y.raw"
  python3 -I "$HERE/check_stats.py" "$id" "$s0300" "$TMP/ssim_raw.txt" "$TMP/ssim_blur.txt" "$TMP/y.raw"
done
rm -rf "$TMP"
