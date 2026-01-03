
export type Language = 'en' | 'ja' | 'vi';

export interface Translation {
  title: string;
  subtitle: string;
  placeholder: string;
  downloadBtn: string;
  features: {
    noWatermark: string;
    highQuality: string;
    fastSpeed: string;
  };
  stats: {
    downloads: string;
    users: string;
    time: string;
  };
  results: {
    video: string;
    audio: string;
    processing: string;
    done: string;
    copyLink: string;
    copied: string;
  };
  history: string;
  trending: string;
  footer: {
    disclaimer: string;
    rights: string;
  };
}

export interface VideoInfo {
  id: string;
  url: string;
  title: string;
  author: string;
  avatar: string;
  cover: string;
  musicTitle: string;
  duration: string;
  timestamp: number;
  videoUrl?: string;
  audioUrl?: string;
}

export interface TrendingVideo {
  title: string;
  author: string;
  cover: string;
  url: string;
  views: string;
}
