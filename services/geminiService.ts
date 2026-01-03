import { GoogleGenAI, Type } from "@google/genai";
import { VideoInfo, TrendingVideo } from "../types";

/**
 * Không dùng .env:
 * - Ưu tiên window.__GEMINI_API_KEY (set trong index.html)
 * - Hoặc localStorage "GEMINI_API_KEY"
 */
const getApiKey = (): string => {
  const w = globalThis as any;
  return (
    w.__GEMINI_API_KEY ||
    (typeof localStorage !== "undefined" ? localStorage.getItem("GEMINI_API_KEY") : null) ||
    ""
  );
};

const getAI = () => {
  const key = getApiKey();
  return key ? new GoogleGenAI({ apiKey: key }) : null;
};

export const fetchTikTokInfo = async (url: string): Promise<VideoInfo> => {
  try {
    // 1) Ưu tiên scraper (không cần key)
    const scraperResponse = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
    );
    const scraperData = await scraperResponse.json();

    if (scraperData?.code === 0 && scraperData?.data) {
      const d = scraperData.data;
      return {
        id: d.id,
        url,
        title: d.title || "TikTok Video",
        author: d.author?.nickname || "@user",
        avatar:
          d.author?.avatar ||
          `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${d.author?.id ?? "user"}`,
        cover: d.cover || d.origin_cover,
        musicTitle: d.music_info?.title || "Original Sound",
        duration: formatDuration(d.duration),
        videoUrl: d.play,
        audioUrl: d.music,
        timestamp: Date.now(),
      };
    }

    // 2) Nếu scraper fail, mới dùng Gemini (nếu có key)
    const ai = getAI();
    if (!ai) {
      // Không có key → trả fallback tối thiểu (không throw để khỏi “die” app)
      return {
        id: "unknown",
        url,
        title: "TikTok Video",
        author: "@user",
        avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=user`,
        cover: `https://picsum.photos/seed/${encodeURIComponent(url)}/600/800`,
        musicTitle: "Original Sound",
        duration: "00:00",
        videoUrl: "",
        audioUrl: "",
        timestamp: Date.now(),
      };
    }

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Phân tích link TikTok này và trả về metadata thực tế: ${url}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            musicTitle: { type: Type.STRING },
            duration: { type: Type.STRING },
          },
          required: ["id", "title", "author", "musicTitle", "duration"],
        },
      },
    });

    const gData = JSON.parse(geminiResponse.text);

    return {
      ...gData,
      url,
      avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
        gData.author
      )}`,
      cover: `https://picsum.photos/seed/${encodeURIComponent(url)}/600/800`,
      timestamp: Date.now(),
    };
  } catch {
    throw new Error("Không thể trích xuất dữ liệu. Vui lòng kiểm tra lại link.");
  }
};

/**
 * QUAN TRỌNG: phải export đúng tên để App.tsx import được
 */
export const fetchTrendingVideos = async (): Promise<TrendingVideo[]> => {
  try {
    const ai = getAI();
    if (!ai) throw new Error("Missing API key");

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents:
        "Search for current viral TikTok trends, hashtags, and popular video topics today. Provide a list of 6 trending items with realistic titles, mock views, and associated popular authors.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              url: { type: Type.STRING },
              views: { type: Type.STRING },
            },
            required: ["title", "author", "url", "views"],
          },
        },
      },
    });

    const data = JSON.parse(response.text);
    return data.map((v: any, i: number) => ({
      ...v,
      cover: `https://picsum.photos/seed/trend_${i}_${encodeURIComponent(v.author)}/600/900`,
    }));
  } catch (error) {
    console.error("Error fetching trending:", error);
    // Fallback nếu AI fail / không có key
    return [
      {
        title: "#ViralDance2024",
        author: "@dancer_pro",
        url: "https://www.tiktok.com/@dancer_pro/video/1",
        views: "12M",
        cover: "https://picsum.photos/seed/dance/600/900",
      },
      {
        title: "Tech Gadgets You Need",
        author: "@techreview",
        url: "https://www.tiktok.com/@techreview/video/2",
        views: "8.5M",
        cover: "https://picsum.photos/seed/tech/600/900",
      },
      {
        title: "ASMR Cooking",
        author: "@chef_asmr",
        url: "https://www.tiktok.com/@chef_asmr/video/3",
        views: "4.1M",
        cover: "https://picsum.photos/seed/food/600/900",
      },
      {
        title: "Gaming Setup 2024",
        author: "@gamer_neon",
        url: "https://www.tiktok.com/@gamer_neon/video/4",
        views: "15M",
        cover: "https://picsum.photos/seed/gaming/600/900",
      },
    ];
  }
};

const formatDuration = (seconds: number): string => {
  if (!seconds) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};
