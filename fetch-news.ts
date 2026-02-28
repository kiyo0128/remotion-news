import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as googleTTS from 'google-tts-api';

// Z.AI (Zhipu AI) LLM API settings
const LLM_API_KEY = process.env.LLM_API_KEY || '98ecaa5ba9d34447a06cec4d7fd900e9.CDFIORObSTXnmftH';
const LLM_BASE_URL = 'https://api.z.ai/api/coding/paas/v4/chat/completions';

// Brave Search API settings
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || 'BSAc99GUo2iEzD7iZYI9g7AGUNGr4fJ';

async function fetchNews() {
    console.log('🔍 [1/3] ニュースを検索中... (Brave Search API)');
    const query = encodeURIComponent('AI LLM 最新ニュース tech');
    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${query}&count=5&freshness=pd`, {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status}`);
    }

    const data = await response.json();
    const searchResults = data.web?.results?.slice(0, 3) || [];

    if (searchResults.length === 0) {
        throw new Error('ニュースが見つかりませんでした。');
    }

    let promptText = "以下の最新ニュース情報をもとに、YouTubeショート動画（縦型）用の原稿を作成してください。JSON形式で出力してください。\n\n【ニュース情報】\n";
    searchResults.forEach((result: any, index: number) => {
        promptText += `${index + 1}. タイトル: ${result.title}\n   概要: ${result.description}\n\n`;
    });

    promptText += `\n【出力形式】
以下のJSONフォーマットで、"\\\`\\\`\\\`json" などのマークダウンを含めず、純粋なJSONテキストのみを出力してください。
音声読み上げ（TTS）に使用するため、読みやすい日本語にしてください。
{
    "themeColor": "#00FFaa",
    "openingText": "AI最新ニュース！本日の注目トピックをお届けします。",
    "newsTitle": "ニュースのメインタイトル（短く）",
    "newsSummary": "ニュースの要約（簡潔に、100文字程度）",
    "endingText": "チャンネル登録をお願いします！"
}`;

    return promptText;
}

async function generateJSON(promptText: string) {
    console.log('🧠 [2/3] LLMでニュースを要約中... (GLM-4)');

    const response = await fetch(LLM_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LLM_API_KEY}`
        },
        body: JSON.stringify({
            model: 'glm-5',
            messages: [
                { role: 'system', content: 'あなたは優秀なニュースキャスターであり、JSONジェネレーターです。' },
                { role: 'user', content: promptText }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`LLM API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Clean up markdown block if the LLM adds it
    if (content.startsWith('```json')) {
        content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    return JSON.parse(content);
}

async function generateAudioAndGetFrames(text: string, filename: string): Promise<number> {
    console.log(`音声生成中: ${filename}...`);
    // Text could be slightly over 200 chars, so use getAllAudioBase64
    const results = await googleTTS.getAllAudioBase64(text, { lang: 'ja', slow: false });
    const buffers = results.map(res => Buffer.from(res.base64, 'base64'));
    const finalBuffer = Buffer.concat(buffers);

    const audioDir = path.join(__dirname, 'public', 'audio');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    const filepath = path.join(audioDir, filename);
    fs.writeFileSync(filepath, finalBuffer);

    try {
        const stdout = execSync(`ffprobe -i "${filepath}" -show_entries format=duration -v quiet -of csv="p=0"`).toString();
        const durationSec = parseFloat(stdout.trim());
        return Math.ceil(durationSec * 30) + 15; // 30fps + 0.5s padding
    } catch (err) {
        console.warn(`ffprobe failed for ${filename}, using fallback duration.`);
        return 150; // fallback to 5 seconds
    }
}

async function main() {
    try {
        // 1. Fetch News & Build Prompt
        const promptText = await fetchNews();

        // 2. Generate required JSON via LLM
        const finalJSON = await generateJSON(promptText);

        // 3. Generate Audio and calculate actual frame count dynamically
        console.log('🎙️ [3/4] 音声を生成しフレーム数を計算中...');
        finalJSON.openingFrames = await generateAudioAndGetFrames(finalJSON.openingText, 'opening.mp3');
        finalJSON.slideFrames = await generateAudioAndGetFrames(finalJSON.newsSummary, 'slide1.mp3');
        finalJSON.endingFrames = await generateAudioAndGetFrames(finalJSON.endingText, 'ending.mp3');

        // 4. Write to props-single.json
        console.log('💾 [4/4] props-single.json を保存中...');
        const outputPath = path.join(__dirname, 'props-single.json');
        fs.writeFileSync(outputPath, JSON.stringify(finalJSON, null, 2), 'utf-8');

        console.log('✅ ニュースの取得とJSON生成が完了しました！');
    } catch (error) {
        console.error('❌ エラーが発生しました:', error);
        process.exit(1);
    }
}

main();
