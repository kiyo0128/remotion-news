import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  Img,
  Sequence,
  staticFile,
  Html5Audio
} from 'remotion';

interface Slide {
  heading: string;
  summary: string;
  image?: string;
  source?: string;
}

interface NewsReportProps {
  title: string;
  date: string;
  slides: Slide[];
  accentColor?: string;
  bgColor?: string;
  imageIndex?: number; // ひとみ画像のインデックス（1-5）
  audioFile?: string; // 音声ファイルパス（public/audio/からの相対パス）
}

// オープニングシーン（3秒）
const Opening: React.FC<{
  title: string;
  date: string;
  accentColor: string;
  bgColor: string;
  imageIndex: number;
}> = ({title, date, accentColor, bgColor, imageIndex}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  const titleY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  const dateOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const hitomiOpacity = interpolate(frame, [20, 45], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const hitomiX = interpolate(frame, [20, 45], [100, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  return (
    <AbsoluteFill style={{background: bgColor}}>
      {/* ひとみ画像（右側） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 800,
          opacity: hitomiOpacity,
          transform: `translateX(${hitomiX}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img
          src={staticFile(`hitomi${imageIndex}.png`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* タイトルエリア */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '70%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 80,
          paddingRight: 40,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            borderBottom: `4px solid ${accentColor}`,
            paddingBottom: 20,
            display: 'inline-block',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 48,
            color: 'rgba(255,255,255,0.85)',
            margin: '30px 0 0 0',
            opacity: dateOpacity,
          }}
        >
          {date}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// スライドシーン（各5秒）
const SlideScene: React.FC<{
  slide: Slide;
  accentColor: string;
  bgColor: string;
  index: number;
  total: number;
}> = ({slide, accentColor, bgColor, index, total}) => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  const headingX = interpolate(frame, [0, 15], [-20, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  const summaryOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const sourceOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const hasImage = slide.image && slide.image.length > 0;

  return (
    <AbsoluteFill style={{background: bgColor, padding: 60}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
          gap: 40,
        }}
      >
        {/* テキストエリア */}
        <div
          style={{
            width: hasImage ? '70%' : '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* ニュース番号 */}
          <div
            style={{
              fontSize: 28,
              color: accentColor,
              marginBottom: 15,
              fontWeight: 'bold',
              opacity: headingOpacity,
            }}
          >
            NEWS {index + 1}
          </div>

          {/* 見出し */}
          <h2
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 30px 0',
              opacity: headingOpacity,
              transform: `translateX(${headingX}px)`,
              borderBottom: `3px solid ${accentColor}`,
              paddingBottom: 15,
              lineHeight: 1.2,
            }}
          >
            {slide.heading}
          </h2>

          {/* 要約 */}
          <p
            style={{
              fontSize: 48,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 25px 0',
              opacity: summaryOpacity,
              lineHeight: 1.5,
              whiteSpace: 'pre-line',
            }}
          >
            {slide.summary}
          </p>

          {/* 出典 */}
          {slide.source && (
            <p
              style={{
                fontSize: 26,
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                opacity: sourceOpacity,
              }}
            >
              出典: {slide.source}
            </p>
          )}
        </div>

        {/* 画像エリア（右側） */}
        {hasImage && (
          <div
            style={{
              width: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Img
              src={staticFile(`images/${slide.image}`)}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                maxHeight: '80%',
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// エンディングシーン（2秒）
const Ending: React.FC<{
  accentColor: string;
  bgColor: string;
  imageIndex: number;
}> = ({accentColor, bgColor, imageIndex}) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  const scale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic)
  });

  return (
    <AbsoluteFill style={{background: bgColor}}>
      {/* ひとみ画像（右側） */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img
          src={staticFile(`hitomi${imageIndex}.png`)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* エンディングテキスト */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '70%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: textOpacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            margin: 0,
            borderBottom: `4px solid ${accentColor}`,
            paddingBottom: 20,
          }}
        >
          Generated by Hitomi
        </h1>
        <p
          style={{
            fontSize: 48,
            color: accentColor,
            margin: '30px 0 0 0',
          }}
        >
          👠
        </p>
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.7)',
            margin: '20px 0 0 0',
          }}
        >
          #AI #TechNews
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const NewsReport: React.FC<NewsReportProps> = ({
  title,
  date,
  slides,
  accentColor = '#EF4444',
  bgColor = '#0f0f23',
  imageIndex = 1,
  audioFile,
}) => {
  const {fps, durationInFrames} = useVideoConfig();

  // 音声の長さに合わせて動的にタイミングを計算
  const totalFrames = durationInFrames;
  const endingFrames = fps * 2; // エンディングは固定2秒
  const remainingFrames = totalFrames - endingFrames;
  
  // オープニングとスライドの配分
  // オープニング: 残りの15%
  // スライド: 残りの85%を均等配分
  const openingDuration = Math.floor(remainingFrames * 0.15);
  const slideTotalFrames = remainingFrames - openingDuration;
  const slideDuration = Math.floor(slideTotalFrames / slides.length);

  return (
    <AbsoluteFill>
      {/* 音声トラック */}
      {audioFile && (
        <Html5Audio src={staticFile(`audio/${audioFile}`)} />
      )}

      {/* オープニング */}
      <Sequence from={0} durationInFrames={openingDuration}>
        <Opening
          title={title}
          date={date}
          accentColor={accentColor}
          bgColor={bgColor}
          imageIndex={imageIndex}
        />
      </Sequence>

      {/* スライド */}
      {slides.map((slide, index) => (
        <Sequence
          key={index}
          from={openingDuration + index * slideDuration}
          durationInFrames={slideDuration}
        >
          <SlideScene
            slide={slide}
            accentColor={accentColor}
            bgColor={bgColor}
            index={index}
            total={slides.length}
          />
        </Sequence>
      ))}

      {/* エンディング */}
      <Sequence
        from={openingDuration + slides.length * slideDuration}
        durationInFrames={endingFrames}
      >
        <Ending
          accentColor={accentColor}
          bgColor={bgColor}
          imageIndex={imageIndex}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
