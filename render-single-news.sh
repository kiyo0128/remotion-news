#!/bin/bash

# 1ニュース構成レンダースクリプト
# 音声ファイルの長さから動画の尺を自動計算
# props-single.jsonから内容を読み込む

cd /Users/watanabekiyoshi/.openclaw/workspace/remotion-news

# 音声ファイルの長さを取得（秒）
OPENING_SEC=$(ffprobe -i public/audio/opening.mp3 -show_entries format=duration -v quiet -of csv="p=0")
SLIDE_SEC=$(ffprobe -i public/audio/slide1.mp3 -show_entries format=duration -v quiet -of csv="p=0")
ENDING_SEC=$(ffprobe -i public/audio/ending.mp3 -show_entries format=duration -v quiet -of csv="p=0")

# フレーム数を計算（30fps）
FPS=30
OPENING_FRAMES=$(echo "$OPENING_SEC * $FPS" | bc | cut -d. -f1)
SLIDE_FRAMES=$(echo "$SLIDE_SEC * $FPS" | bc | cut -d. -f1)
ENDING_FRAMES=$(echo "$ENDING_SEC * $FPS" | bc | cut -d. -f1)

# 合計フレーム数
TOTAL_FRAMES=$((OPENING_FRAMES + SLIDE_FRAMES + ENDING_FRAMES))

# 合計時間
TOTAL_SEC=$(echo "$OPENING_SEC + $SLIDE_SEC + $ENDING_SEC" | bc)

echo "=========================================="
echo "📊 音声長さ"
echo "  オープニング: ${OPENING_SEC}秒 (${OPENING_FRAMES}フレーム)"
echo "  ニュース: ${SLIDE_SEC}秒 (${SLIDE_FRAMES}フレーム)"
echo "  エンディング: ${ENDING_SEC}秒 (${ENDING_FRAMES}フレーム)"
echo "------------------------------------------"
echo "🎬 動画情報"
echo "  合計時間: ${TOTAL_SEC}秒"
echo "  合計フレーム: ${TOTAL_FRAMES}フレーム (${FPS}fps)"
echo "=========================================="
echo ""

# props-single.jsonの内容にフレーム情報を追加して生成
node -e "
const fs = require('fs');
const props = JSON.parse(fs.readFileSync('props-single.json', 'utf8'));
props.openingFrames = ${OPENING_FRAMES};
props.slideFrames = ${SLIDE_FRAMES};
props.endingFrames = ${ENDING_FRAMES};
console.log(JSON.stringify(props, null, 2));
" > props-single-generated.json

echo "📝 props.json生成完了"
echo ""

# 動画をレンダリング
npx remotion render SingleNews out/single-news.mp4 --props=props-single-generated.json --frames=0-$TOTAL_FRAMES

echo ""
echo "✅ レンダリング完了: out/single-news.mp4"
