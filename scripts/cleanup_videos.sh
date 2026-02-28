#!/bin/bash

# 動画ファイル整理スクリプト
# 10件を超えたら古いものから削除

OUT_DIR="/Users/watanabekiyoshi/.openclaw/workspace/remotion-news/out"
MAX_FILES=10

# mp4ファイル一覧（古い順）
cd "$OUT_DIR"

# ファイル数を取得
FILE_COUNT=$(ls -1 *.mp4 2>/dev/null | wc -l)

if [ "$FILE_COUNT" -gt "$MAX_FILES" ]; then
  # 削除する件数
  DELETE_COUNT=$((FILE_COUNT - MAX_FILES))
  
  # 古い順に削除
  ls -1t *.mp4 | tail -n $DELETE_COUNT | xargs rm -f
  
  echo "Deleted $DELETE_COUNT old video(s)"
else
  echo "No cleanup needed ($FILE_COUNT files)"
fi
