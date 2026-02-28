#!/bin/bash

# 音声付き動画レンダースクリプト
# 音声の長さから自動的に動画の尺を計算

cd /Users/watanabekiyoshi/.openclaw/workspace/remotion-news

PROPS_FILE="props.json"
AUDIO_FILE=$(grep -o '"audioFile"[[:space:]]*:[[:space:]]*"[^"]*"' $PROPS_FILE | grep -o '"[^"]*"$' | tr -d '"')

if [ -z "$AUDIO_FILE" ]; then
  echo "音声ファイルが指定されていません"
  exit 1
fi

AUDIO_PATH="public/audio/$AUDIO_FILE"

if [ ! -f "$AUDIO_PATH" ]; then
  echo "音声ファイルが見つかりません: $AUDIO_PATH"
  exit 1
fi

# 音声の長さを取得（秒）
DURATION=$(ffprobe -i "$AUDIO_PATH" -show_entries format=duration -v quiet -of csv="p=0")

# フレーム数を計算（30fps）
FPS=30
FRAMES=$(echo "$DURATION * $FPS" | bc | cut -d. -f1)

# 最低フレーム数を確保（最低3秒 = 90フレーム）
if [ "$FRAMES" -lt 90 ]; then
  FRAMES=90
fi

echo "音声の長さ: ${DURATION}秒"
echo "フレーム数: ${FRAMES}フレーム (${FPS}fps)"
echo "動画の長さ: $(echo "scale=1; $FRAMES / $FPS" | bc)秒"
echo ""

# 動画をレンダリング
npx remotion render NewsReport out/news-with-audio.mp4 --props=$PROPS_FILE --frames=0-$FRAMES

echo ""
echo "レンダリング完了: out/news-with-audio.mp4"
