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
  Audio
} from 'remotion';

interface SingleNewsProps {
  title: string;
  date: string;
  heading: string;
  summary: string;
  source?: string;
  accentColor?: string;
  bgColor?: string;
  imageIndex?: number;
  // 音声の長さ（フレーム数）
  openingFrames?: number;
  slideFrames?: number;
  endingFrames?: number;
}

// オープニングシーン
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

// ニューススライドシーン
const NewsSlide: React.FC<{
  heading: string;
  summary: string;
  source?: string;
  accentColor: string;
  bgColor: string;
  imageIndex: number;
}> = ({heading, summary, source, accentColor, bgColor, imageIndex}) => {
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
        <div
          style={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: accentColor,
              marginBottom: 15,
              fontWeight: 'bold',
              opacity: headingOpacity,
            }}
          >
            NEWS
          </div>
          <h2
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#ffffff',
              margin: '0 0 30px 0',
              opacity: headingOpacity,
              transform: `translateX(${headingX}px)`,
              borderBottom: `3px solid ${accentColor}`,
              paddingBottom: 15,
              lineHeight: 1.3,
            }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontSize: 42,
              color: 'rgba(255,255,255,0.85)',
              margin: '0 0 25px 0',
              opacity: summaryOpacity,
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {summary}
          </p>
          {source && (
            <p
              style={{
                fontSize: 26,
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                opacity: sourceOpacity,
              }}
            >
              出典: {source}
            </p>
          )}
        </div>
        <div
          style={{
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
      </div>
    </AbsoluteFill>
  );
};

// エンディングシーン
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

export const SingleNews: React.FC<SingleNewsProps> = ({
  title,
  date,
  heading,
  summary,
  source,
  accentColor = '#EF4444',
  bgColor = '#0f0f23',
  imageIndex = 1,
  openingFrames = 90,  // デフォルト3秒
  slideFrames = 300,   // デフォルト10秒
  endingFrames = 60,   // デフォルト2秒
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalFrames = openingFrames + slideFrames + endingFrames;

  // BGMのフェードアウト（最後の1秒）
  const fadeOutStart = totalFrames - fps;
  const bgmVolume = interpolate(
    frame,
    [0, fadeOutStart, totalFrames],
    [0.12, 0.12, 0],
    {extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill>
      {/* BGM（ループ、フェードアウト付き） */}
      <Audio
        src={staticFile('audio/bgm.mp3')}
        volume={bgmVolume}
        loop
      />

      {/* オープニング */}
      <Sequence from={0} durationInFrames={openingFrames}>
        <Opening
          title={title}
          date={date}
          accentColor={accentColor}
          bgColor={bgColor}
          imageIndex={imageIndex}
        />
        <Audio src={staticFile('audio/opening.mp3')} />
      </Sequence>

      {/* ニューススライド */}
      <Sequence from={openingFrames} durationInFrames={slideFrames}>
        <NewsSlide
          heading={heading}
          summary={summary}
          source={source}
          accentColor={accentColor}
          bgColor={bgColor}
          imageIndex={imageIndex}
        />
        <Audio src={staticFile('audio/slide1.mp3')} />
      </Sequence>

      {/* エンディング */}
      <Sequence from={openingFrames + slideFrames} durationInFrames={endingFrames}>
        <Ending
          accentColor={accentColor}
          bgColor={bgColor}
          imageIndex={imageIndex}
        />
        <Audio src={staticFile('audio/ending.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
