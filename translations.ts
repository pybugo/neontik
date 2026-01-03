
import { Language } from './types';

export const translations: Record<Language, any> = {
  en: {
    title: 'NEON TOK',
    subtitle: '',
    placeholder: 'Paste TikTok link here...',
    downloadBtn: 'EXTRACT',
    autoPaste: 'Paste',
    audioNote: 'Note: If the MP3 is only 60s, it is a TikTok copyright restriction. To get the full audio, please download the Video (MP4) and extract the sound.',
    results: {
      video: 'Video (MP4)',
      audio: 'Audio (MP3)',
      processing: 'Decrypting link...',
      done: 'Ready to extract!',
      copyLink: 'Original URL',
      copyDownload: 'DL Link',
      copied: 'Copied!'
    },
    steps: {
      title: 'Operational Guide',
      step1: 'Copy TikTok URL',
      step2: 'Paste into Neon Engine',
      step3: 'Extract & Download'
    },
    errors: {
      invalidUrl: 'Error: Invalid link.',
      fetchFailed: 'Error: Server busy.',
      permissionDenied: 'Error: Permission denied.'
    },
    stages: ['Initializing Core', 'AI Scraping', 'WM Bypassing', 'Optimization', 'Finalizing'],
    history: 'History',
    trending: 'Trending Now',
    footer: {
      disclaimer: 'Personal use only. Not affiliated with TikTok.',
      rights: 'NeonTok X KaceStore.'
    }
  },
  vi: {
    title: 'NEON TOK',
    subtitle: '',
    placeholder: 'Dán link TikTok tại đây...',
    downloadBtn: 'TRÍCH XUẤT',
    autoPaste: 'Dán Link',
    audioNote: 'Mẹo: Nếu nhạc MP3 bị ngắn (60s), đó là do giới hạn bản quyền TikTok. Bạn nên tải Video (MP4) để có bản nhạc đầy đủ nhất đi kèm video.',
    results: {
      video: 'Tải Video (MP4)',
      audio: 'Tải Nhạc (MP3)',
      processing: 'Đang giải mã liên kết...',
      done: 'Hệ thống đã sẵn sàng!',
      copyLink: 'Link gốc',
      copyDownload: 'Link tải',
      copied: 'Đã chép!'
    },
    steps: {
      title: 'Hướng Dẫn Sử Dụng',
      step1: 'Sao chép link video TikTok',
      step2: 'Dán vào hệ thống NeonTok',
      step3: 'Chọn định dạng và tải về'
    },
    errors: {
      invalidUrl: 'Lỗi: Link không hợp lệ.',
      fetchFailed: 'Lỗi: Máy chủ đang bận.',
      permissionDenied: 'Lỗi: Không có quyền truy cập Clipboard.'
    },
    stages: ['Khởi tạo nhân hệ thống', 'Đang quét dữ liệu AI', 'Đang xóa dấu Watermark', 'Tối ưu hóa tệp tin', 'Hoàn tất trích xuất'],
    history: 'Lịch sử tải',
    trending: 'Xu hướng thịnh hành',
    footer: {
      disclaimer: 'Chỉ sử dụng cho mục đích cá nhân. Không lưu trữ nội dung trái phép.',
      rights: 'Bản quyền © 2025 NeonTok X KaceStore.'
    }
  },
  ja: {
    title: 'NEON TOK',
    subtitle: '',
    placeholder: 'リンクを貼り付けてください...',
    downloadBtn: '抽出',
    autoPaste: '貼り付け',
    audioNote: '注意：MP3が60秒のみの場合、TikTokの著作権制限によるものです。フルバージョンが必要な場合はビデオをダウンロードしてください。',
    results: {
      video: 'ビデオ (MP4)',
      audio: 'オーディオ (MP3)',
      processing: '解析中...',
      done: '完了！',
      copyLink: 'リンクをコピー',
      copyDownload: 'DLリンクをコピー',
      copied: 'コピー完了'
    },
    steps: {
      title: '使用方法',
      step1: 'URL को कॉपी',
      step2: '貼り付け',
      step3: 'ダウンロード'
    },
    errors: {
      invalidUrl: 'エラー: 無効なリンク。',
      fetchFailed: 'エラー: サーバーがビジーです。',
      permissionDenied: 'エラー: クリップボードへのアクセスが拒否されました。'
    },
    stages: ['初期化中', 'スクレイピング中', '透かし除去中', '最適化中', '完了'],
    history: '抽出履歴',
    trending: 'トレンド',
    footer: {
      disclaimer: '個人利用のみ。著作権を尊重してください。',
      rights: 'NeonTok X KaceStore.'
    }
  }
};
