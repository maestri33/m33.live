#!/usr/bin/env bash
set -euo pipefail

mkdir -p public/assets/videos /tmp/ministry-posters

# Fast studio-grade filmic color, lighting, contrast, low-light denoise & crisp sharpening
GRADE="curves=master='0/0 0.22/0.19 0.52/0.55 0.80/0.86 1/1',eq=contrast=1.09:brightness=0.03:saturation=1.13:gamma=1.04,colorbalance=rs=0.03:gs=0.01:bs=-0.03:rm=0.02:gm=0.008:bm=-0.02:rh=0.018:bh=-0.014,hqdn3d=1.4:1.4:4:4,unsharp=5:5:0.60:3:3:0.15"

# Broadcast vocal clarity & loudness normalization chain
AUDIO_FILTER="highpass=f=85,afftdn=nf=-24,equalizer=f=3000:t=q:w=1.4:g=2.4,acompressor=threshold=-18dB:ratio=3:attack=10:release=120:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=10"

echo "1/5 Encoding 16:9 HD 30s highlight loop (ministry-highlight.mp4)..."
ffmpeg -y -ss 0 -t 30 \
  -i "public/assets/aistudio/v1c044g50000dao8ku7og65l0cid3mi0_a3292371.MP4" \
  -filter_complex "\
[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=28:8,eq=contrast=1.06:brightness=-0.22:saturation=0.80,colorbalance=rs=0.04:bs=-0.04[bg];\
[0:v]${GRADE},scale=-2:720:flags=lanczos[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,vignette=PI/6,format=yuv420p[outv]" \
  -map "[outv]" -map "0:a?" \
  -c:v libx264 -preset fast -crf 21 -r 30 \
  -c:a aac -b:a 128k -af "${AUDIO_FILTER}" \
  -movflags +faststart \
  "public/assets/ministry-highlight.mp4" -loglevel warning

ffmpeg -y -ss 4.5 -i "public/assets/ministry-highlight.mp4" -frames:v 1 -q:v 2 \
  "/tmp/ministry-posters/poster-highlight.jpg" -loglevel warning

echo "2/5 Encoding HD vertical clip: Nova Natureza em Cristo (30s, uncropped with ambient fill)..."
ffmpeg -y -ss 0 -t 30 \
  -i "public/assets/aistudio/v1c044g50000dao8ku7og65l0cid3mi0_a3292371.MP4" \
  -filter_complex "\
[0:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,boxblur=24:6,eq=brightness=-0.22:saturation=0.78,colorbalance=rs=0.03:bs=-0.03[bg];\
[0:v]${GRADE},scale=720:-2:flags=lanczos[fg];\
[bg][fg]overlay=(W-w)/2:(H-h)/2,vignette=PI/7,format=yuv420p[outv]" \
  -map "[outv]" -map "0:a?" \
  -c:v libx264 -preset fast -crf 22 -r 30 \
  -c:a aac -b:a 128k -af "${AUDIO_FILTER}" \
  -movflags +faststart \
  "public/assets/videos/nova-natureza.mp4" -loglevel warning

ffmpeg -y -ss 4.5 -i "public/assets/videos/nova-natureza.mp4" -frames:v 1 -q:v 2 \
  "/tmp/ministry-posters/poster-nova-natureza.jpg" -loglevel warning

echo "3/5 Encoding HD vertical clip: Guiado pelo Espírito Santo (19s)..."
ffmpeg -y -ss 0 -t 19 \
  -i "public/assets/aistudio/v1c044g50000d8asitvog65tnbkkkvfg_ce172952.MP4" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,${GRADE},format=yuv420p" \
  -c:v libx264 -preset fast -crf 22 -r 30 \
  -c:a aac -b:a 128k -af "${AUDIO_FILTER}" \
  -movflags +faststart \
  "public/assets/videos/guiado-pelo-espirito.mp4" -loglevel warning

ffmpeg -y -ss 3.0 -i "public/assets/videos/guiado-pelo-espirito.mp4" -frames:v 1 -q:v 2 \
  "/tmp/ministry-posters/poster-guiado-pelo-espirito.jpg" -loglevel warning

echo "4/5 Encoding HD vertical clip: Precioso pra Mim é Jesus · Ceia do Senhor (24s)..."
ffmpeg -y -ss 0 -t 24 \
  -i "public/assets/aistudio/IMG_2352_00b00c3f.MOV" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,${GRADE},format=yuv420p" \
  -c:v libx264 -preset fast -crf 22 -r 30 \
  -c:a aac -b:a 128k -af "${AUDIO_FILTER}" \
  -movflags +faststart \
  "public/assets/videos/ceia-do-senhor.mp4" -loglevel warning

ffmpeg -y -ss 4.0 -i "public/assets/videos/ceia-do-senhor.mp4" -frames:v 1 -q:v 2 \
  "/tmp/ministry-posters/poster-ceia-do-senhor.jpg" -loglevel warning

echo "5/5 Encoding HD vertical clip: Adoração na Igreja Local (25s)..."
ffmpeg -y -ss 0 -t 25 \
  -i "public/assets/aistudio/1bd4b420-86cc-4cf9-8dd4-df17d4c82050_e7ca8a28.MOV" \
  -vf "scale=720:1280:force_original_aspect_ratio=increase:flags=lanczos,crop=720:1280,eq=brightness=0.04:gamma=1.08,${GRADE},format=yuv420p" \
  -c:v libx264 -preset fast -crf 22 -r 30 \
  -c:a aac -b:a 128k -af "${AUDIO_FILTER}" \
  -movflags +faststart \
  "public/assets/videos/adoracao-igreja.mp4" -loglevel warning

ffmpeg -y -ss 6.0 -i "public/assets/videos/adoracao-igreja.mp4" -frames:v 1 -q:v 2 \
  "/tmp/ministry-posters/poster-adoracao-igreja.jpg" -loglevel warning

ls -lh public/assets/ministry-highlight.mp4 public/assets/videos/*.mp4
