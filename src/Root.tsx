import React from 'react';
import {Composition} from 'remotion';
import {NewsVideo} from './NewsVideo';
import {NewsReport} from './compositions/NewsReport';
import {SingleNews} from './compositions/SingleNews';

// 日付から画像インデックス（1-5）を決定（ランダム選択用）
const getImageIndex = (dateStr: string): number => {
  // 日付の数字を合計して1-5の範囲に変換
  const day = parseInt(dateStr.split('.')[2] || '1');
  return ((day - 1) % 5) + 1;
};

// ランダムな画像インデックスを生成
const getRandomImageIndex = (): number => {
  return Math.floor(Math.random() * 5) + 1;
};

export const RemotionRoot: React.FC = () => {
  const randomImageIndex = getRandomImageIndex();

  return (
    <>
      {/* 新しいテンプレート仕様準拠のNewsReport */}
      <Composition
        id="NewsReport"
        component={NewsReport}
        durationInFrames={3000} // 音声に合わせて動的に変更可能（最大100秒）
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "今週のAIニュースまとめ",
          date: "2026年2月24日",
          slides: [
            {
              heading: "MetaがNvidiaに大規模投資",
              summary: "MetaがNvidiaのAIアクセラレータに集中投資を発表。AIインフラの強化を加速させます。",
              source: "Tech News"
            },
            {
              heading: "OpenAI新モデル発表",
              summary: "OpenAIが次世代モデルを発表。推論能力が大幅に向上し、より複雑なタスクに対応可能に。",
              source: "AI Weekly"
            },
            {
              heading: "Google、Gemini大幅アップデート",
              summary: "GoogleがGeminiの大幅アップデートを実施。マルチモーダル能力が強化されました。",
              source: "Google Blog"
            }
          ],
          accentColor: "#EF4444",
          bgColor: "#0f0f23",
          imageIndex: randomImageIndex
        }}
      />

      {/* 1ニュース構成（音声同期版） */}
      <Composition
        id="SingleNews"
        component={SingleNews}
        durationInFrames={3000} // 音声に合わせて動的に変更可能（最大100秒）
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "AIニュース",
          date: "2026年2月25日",
          heading: "LeCun氏がMetaを退職",
          summary: "AIの第一人者、ヤン・ルカン氏がMetaを退職し、自身のワールドモデル研究所を立ち上げました。",
          source: "TechCrunch",
          accentColor: "#EF4444",
          bgColor: "#0f0f23",
          imageIndex: randomImageIndex
        }}
      />

      {/* 旧バージョン（後方互換性のため残す） */}
      <Composition
        id="NewsVideo"
        component={NewsVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "AIニュース",
          date: "2026.02.26",
          news: [
            {
              title: "AIエージェントが経済を破壊する「ドゥームズデイ・シナリオ」が市場を震撼",
              quote: "Citrini Researchの予測：2028年までに失業率10%超、AIが「ブレーキのないフィードバックループ」を生み出す",
              url: "https://www.theguardian.com/technology/2026/feb/24/feedback-loop-no-brake-how-ai-doomsday-report-rattled-markets"
            }
          ],
          comment: "DX推進と社会影響のバランスを取るのが技術者倫理の核心。AI導入は効率だけでなく、雇用への影響を含めた包括的リスク評価が不可欠だ。",
          imageIndex: 1
        }}
      />
    </>
  );
};
