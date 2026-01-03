
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download, 
  Gamepad2, 
  Globe, 
  History, 
  Music, 
  Play, 
  Zap, 
  Copy,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Moon,
  Sun,
  ClipboardPaste,
  Info,
  AlertTriangle,
  ArrowRightCircle,
  Loader2,
  Terminal,
  ExternalLink,
  X,
  ShoppingBag,
  Heart,
  Sparkles,
  Link,
  Volume2,
  ChevronRight,
  ChevronLeft,
  Cpu,
  ShieldCheck,
  Activity,
  FileAudio
} from 'lucide-react';
import { Language, VideoInfo, TrendingVideo } from './types';
import { translations } from './translations';
import { fetchTikTokInfo, fetchTrendingVideos } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('vi');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<VideoInfo[]>([]);
  const [trending, setTrending] = useState<TrendingVideo[]>([]);
  const [copiedType, setCopiedType] = useState<'url' | 'dl' | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [downloadingFormat, setDownloadingFormat] = useState<'mp4' | 'mp3' | null>(null);
  const [showModal, setShowModal] = useState(false);

  const t = translations[lang];
  const progressInterval = useRef<number | null>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastDismissed = localStorage.getItem('neontok_modal_time');
    const now = Date.now();
    if (!lastDismissed || now - parseInt(lastDismissed) > 2 * 60 * 60 * 1000) {
      setTimeout(() => setShowModal(true), 1500);
    }

    const saved = localStorage.getItem('neontok_history');
    if (saved) setHistory(JSON.parse(saved));

    fetchTrendingVideos().then(setTrending);
  }, []);

  const dismissModal = (for2h: boolean) => {
    if (for2h) localStorage.setItem('neontok_modal_time', Date.now().toString());
    setShowModal(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null);
      }
    } catch (err) {
      setError(t.errors?.permissionDenied || 'Clipboard error');
    }
  };

  const handleDownloadAction = async (customUrl?: string) => {
    const targetUrl = customUrl || url.trim();
    if (!targetUrl) return;
    
    if (!targetUrl.includes('tiktok.com')) {
      setError(t.errors.invalidUrl);
      return;
    }

    setIsLoading(true);
    setResult(null);
    startProgress();
    
    try {
      const info = await fetchTikTokInfo(targetUrl);
      setProgress(100);
      setStageIndex(t.stages.length - 1);
      
      setTimeout(() => {
        setResult(info);
        setHistory(prev => {
          const filtered = prev.filter(item => item.url !== info.url);
          const updated = [info, ...filtered].slice(0, 10);
          localStorage.setItem('neontok_history', JSON.stringify(updated));
          return updated;
        });
        setIsLoading(false);
        if (!customUrl) setUrl('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (progressInterval.current) clearInterval(progressInterval.current);
      }, 1000);
    } catch (err: any) {
      setError(err.message || t.errors.fetchFailed);
      setIsLoading(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }
  };

  const startProgress = () => {
    setProgress(0);
    setStageIndex(0);
    setError(null);
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return prev;
        const next = prev + (Math.random() * 10);
        const stage = Math.min(Math.floor((next / 100) * t.stages.length), t.stages.length - 1);
        setStageIndex(stage);
        return next;
      });
    }, 180);
  };

  const triggerFileDownload = async (format: 'mp4' | 'mp3') => {
    if (!result) return;
    const mediaUrl = format === 'mp4' ? result.videoUrl : result.audioUrl;
    if (!mediaUrl) return;
    
    setDownloadingFormat(format);
    
    try {
      const response = await fetch(mediaUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      const fileName = `NeonTok_${result.id}_${format === 'mp4' ? 'Video' : 'Audio'}.${format}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(mediaUrl, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopy = (text: string, type: 'url' | 'dl') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const scrollTrending = (dir: 'left' | 'right') => {
    if (trendingRef.current) {
      const { scrollLeft, clientWidth } = trendingRef.current;
      const scrollAmount = clientWidth * 0.8;
      trendingRef.current.scrollTo({
        left: dir === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 font-gaming selection:bg-cyan-500/30 ${darkMode ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Cyber Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[140px] rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-500/10 blur-[140px] rounded-full animate-pulse-glow" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/5 blur-[180px] rounded-full"></div>
      </div>

      {/* Promotional Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="glass max-w-lg w-full rounded-[3rem] overflow-hidden border-cyan-500/40 neon-border-cyan animate-in zoom-in-95 duration-500 shadow-[0_0_100px_rgba(6,182,212,0.25)] relative">
            <div className="scanline"></div>
            <div className="relative p-12 text-center space-y-10">
              <button onClick={() => dismissModal(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-all group active:scale-90">
                <X size={28} className="text-slate-500 group-hover:text-white" />
              </button>
              
              <div className="w-28 h-28 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl rotate-6 hover:rotate-0 transition-all duration-700 group cursor-pointer">
                <ShoppingBag size={56} className="text-white group-hover:scale-110 transition-transform" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-bold tracking-tighter uppercase italic glitch-hover">
                  HỖ TRỢ BỞI <span className="text-cyan-400">KACESTORE</span>
                </h3>
                <p className="text-slate-400 font-sans text-lg leading-relaxed px-4">
                  Trải nghiệm giải trí không giới hạn. Nâng cấp tài khoản Premium tại KaceStore ngay hôm nay!
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-2 hover:border-cyan-500/30 transition-all">
                  <Cpu size={20} className="text-cyan-400" />
                  <p className="font-bold text-xs uppercase tracking-widest text-slate-300">Công nghệ AI</p>
                  <p className="text-[10px] text-slate-500">Xử lý trích xuất siêu tốc</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/10 space-y-2 hover:border-pink-500/30 transition-all">
                  <ShieldCheck size={20} className="text-pink-400" />
                  <p className="font-bold text-xs uppercase tracking-widest text-slate-300">Bảo mật cao</p>
                  <p className="text-[10px] text-slate-500">Cam kết bảo hành uy tín</p>
                </div>
              </div>

              <div className="flex flex-col gap-5 pt-4">
                <a 
                  href="https://kacestore.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 rounded-[2rem] font-bold text-2xl tracking-widest hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(6,182,212,0.4)] italic uppercase"
                >
                  MỞ KACESTORE <ArrowRightCircle size={24} />
                </a>
                <button 
                  onClick={() => dismissModal(true)}
                  className="text-[11px] font-bold text-slate-600 hover:text-cyan-400 transition-colors uppercase tracking-[0.3em]"
                >
                  Tắt thông báo trong 2 giờ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-50 glass border-b ${darkMode ? 'border-white/5' : 'border-slate-200'} px-6 py-5`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-2xl flex items-center justify-center neon-border-cyan group-hover:scale-110 transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] group-hover:rotate-12">
              <Gamepad2 className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase glitch-hover">
              <span className="text-cyan-400">NEON</span>
              <span className="text-pink-500">TOK</span>
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/60 border border-cyan-500/20 text-[10px] font-bold shadow-[0_0_15px_rgba(6,182,212,0.1)]">
               <Activity className="w-3 h-3 text-green-500 animate-pulse" />
               <span className="text-cyan-400 tracking-[0.2em] uppercase">SYSTEM ONLINE: KACESTORE v4.8</span>
            </div>
            
            <button onClick={() => setDarkMode(!darkMode)} className="p-3 hover:bg-white/10 rounded-2xl transition-all active:scale-90 glass border-white/5">
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-2xl glass text-[10px] font-bold uppercase tracking-widest border-white/10 hover:border-cyan-500/50 transition-all active:scale-95 shadow-lg">
                <Globe size={16} className="text-cyan-400" />
                <span>{lang}</span>
              </button>
              <div className="absolute right-0 top-full mt-3 w-44 glass rounded-[1.5rem] overflow-hidden hidden group-hover:block border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] animate-in slide-in-from-top-4 duration-300">
                {(['en', 'vi', 'ja'] as Language[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} className="w-full text-left px-6 py-5 hover:bg-cyan-500/20 transition-all text-xs font-bold uppercase tracking-widest border-b border-white/5 last:border-0 flex items-center justify-between group/lang">
                    {l === 'en' ? 'English' : l === 'vi' ? 'Tiếng Việt' : '日本語'}
                    <ChevronRight size={14} className="opacity-0 group-hover/lang:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 lg:py-28 relative">
        {/* Banner Section */}
        <section className="text-center mb-24 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold tracking-[0.5em] uppercase shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-pulse">
            <Sparkles size={16} /> TRÍCH XUẤT AI THẾ HỆ MỚI
          </div>
          <div className="relative inline-block">
             <h2 className="text-8xl md:text-[11rem] font-black tracking-tighter leading-none italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 py-6 filter drop-shadow-[0_0_40px_rgba(6,182,212,0.3)] select-none">
              {t.title}
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-[2px] opacity-50"></div>
          </div>
        </section>

        {/* Input Interface */}
        <div className="relative mb-28 group max-w-4xl mx-auto">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-[3rem] blur-3xl opacity-10 group-focus-within:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row gap-5 p-5 glass rounded-[3rem] border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="scanline"></div>
            <div className="flex-1 flex items-center min-w-0 bg-[#0f172a]/50 rounded-[2.2rem] border border-white/5 focus-within:border-cyan-500/50 transition-all shadow-inner">
              <input 
                type="text" 
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null); }}
                placeholder={t.placeholder}
                className="flex-1 bg-transparent px-10 py-7 text-2xl outline-none placeholder:text-slate-700 font-bold truncate text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleDownloadAction()}
              />
              <button onClick={handlePaste} className="px-10 text-slate-500 hover:text-cyan-400 transition-all flex items-center gap-3 font-bold text-[11px] uppercase tracking-[0.2em] border-l border-white/10 h-12 my-auto group/paste">
                <ClipboardPaste size={22} className="group-hover/paste:scale-110 transition-transform" />
                <span className="hidden lg:inline">{t.autoPaste}</span>
              </button>
            </div>
            <button 
              onClick={() => handleDownloadAction()}
              disabled={isLoading || !url}
              className="px-16 py-7 bg-gradient-to-br from-cyan-500 to-blue-700 rounded-[2.2rem] font-black text-2xl tracking-widest hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-5 italic shadow-[0_15px_30px_rgba(6,182,212,0.3)] uppercase min-w-[260px] group/btn"
            >
              {isLoading ? <Loader2 className="animate-spin w-10 h-10" /> : (
                <>
                  {t.downloadBtn} <Zap size={28} fill="currentColor" className="group-hover/btn:scale-125 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-16 p-8 bg-red-500/10 border border-red-500/40 rounded-[2rem] flex items-center gap-6 text-red-400 animate-in slide-in-from-top-6 font-sans font-bold shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="p-4 bg-red-500/20 rounded-3xl shrink-0">
              <AlertTriangle size={36} />
            </div>
            <p className="text-lg uppercase tracking-wider leading-tight">{error}</p>
          </div>
        )}

        {/* Loading UI */}
        {isLoading && (
          <div className="glass rounded-[3.5rem] p-16 mb-20 border-cyan-500/40 neon-border-cyan animate-in fade-in duration-700 shadow-[0_0_80px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="scanline opacity-20"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-16 relative z-10">
              <div className="space-y-7 flex-1 w-full">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] text-cyan-400/60 font-black tracking-[0.5em] uppercase mb-1">
                         <Terminal size={14} /> AI PROCESSOR ACTIVE
                      </div>
                      <h3 className="text-cyan-400 font-black tracking-[0.3em] italic uppercase text-3xl lg:text-4xl drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                        {t.stages[stageIndex]}
                      </h3>
                   </div>
                  <span className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] mb-2">BYPASSING...</span>
                </div>
                <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden p-1.5 border border-white/10 shadow-2xl relative">
                   <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 progress-bar rounded-full relative" style={{width: `${progress}%`}}>
                      <div className="absolute inset-0 progress-bar-shimmer"></div>
                   </div>
                </div>
              </div>
              <div className="text-7xl lg:text-[10rem] font-black italic text-white/90 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)] select-none">
                {Math.round(progress)}
              </div>
            </div>
          </div>
        )}

        {/* REFINED Result UI based on Image Sample */}
        {result && !isLoading && (
          <div className="glass rounded-[4rem] border-cyan-500/30 neon-border-cyan animate-in zoom-in-95 duration-700 mb-28 shadow-[0_0_150px_rgba(0,0,0,0.4)] relative">
            <div className="p-8 lg:p-12 flex flex-col lg:flex-row gap-10 lg:gap-14">
              {/* Left: Thumbnail Column */}
              <div className="w-full lg:w-[360px] aspect-[9/16] relative rounded-[3rem] overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 shrink-0 mx-auto">
                <img src={result.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent"></div>
                
                {/* Author Info at Bottom of Thumbnail */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-[1.8rem] border border-white/10">
                   <div className="relative">
                      <img src={result.avatar} className="w-12 h-12 rounded-xl border-2 border-cyan-500 p-0.5 bg-slate-900 object-cover" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border border-black flex items-center justify-center">
                         <CheckCircle2 size={8} className="text-white" />
                      </div>
                   </div>
                   <div className="min-w-0">
                      <span className="block text-sm font-black tracking-tight uppercase truncate text-white italic">{result.author}</span>
                      <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.2em]">Verified Creator</span>
                   </div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute top-6 right-6 px-3 py-1 glass rounded-lg text-[9px] font-black tracking-[0.2em] bg-black/60 border-white/10 uppercase italic">
                  LEN: {result.duration}
                </div>
              </div>

              {/* Right: Info & Action Column */}
              <div className="flex-1 flex flex-col gap-8 py-2 min-h-0">
                {/* Hashtags Stack - COMPACT STACKING */}
                <div className="space-y-4">
                  <div className="text-4xl lg:text-[4.5rem] font-black italic uppercase leading-[0.9] text-white tracking-tighter filter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden">
                    <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                      {result.title.split(' ').map((word, i) => (
                        word.trim() && <span key={i} className="block truncate">{word.startsWith('#') ? word : `#${word}`}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Music Info Pill Button - SMALLER */}
                  <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass border-pink-500/30 text-pink-400 shadow-lg group/music cursor-default">
                    <Music size={16} className="group-hover:rotate-12 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] truncate max-w-[280px] italic">
                      {result.musicTitle}
                    </span>
                  </div>
                </div>

                {/* Major Download Actions - REDUCED SIZE & MATCHING STYLE */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* MP4 BUTTON */}
                    <button 
                      onClick={() => triggerFileDownload('mp4')} 
                      disabled={downloadingFormat === 'mp4'} 
                      className="flex items-center justify-between px-4 py-4 bg-gradient-to-br from-cyan-600 to-blue-800 hover:brightness-110 text-white rounded-[1.5rem] font-black transition-all group italic uppercase tracking-[0.1em] text-base shadow-2xl active:scale-95 disabled:opacity-50 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                         {downloadingFormat === 'mp4' ? <Loader2 className="animate-spin w-5 h-5" /> : <Download size={22} />} 
                         <div className="text-left leading-none">
                            TẢI VIDEO<br/><span className="text-[10px] opacity-70">(MP4)</span>
                         </div>
                      </div>
                      <div className="flex flex-col items-center justify-center px-2 py-1 bg-black/30 rounded-lg border border-white/10 ml-2">
                        <span className="text-[7px] font-black">UHD</span>
                        <span className="text-[7px] font-black">4K</span>
                      </div>
                    </button>

                    {/* MP3 BUTTON */}
                    <button 
                      onClick={() => triggerFileDownload('mp3')} 
                      disabled={downloadingFormat === 'mp3'} 
                      className="flex items-center justify-between px-4 py-4 glass border-pink-500/40 text-pink-400 hover:bg-pink-500/10 rounded-[1.5rem] font-black transition-all italic uppercase tracking-[0.1em] text-base active:scale-95 disabled:opacity-50 group shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                         {downloadingFormat === 'mp3' ? <Loader2 className="animate-spin w-5 h-5" /> : <Music size={22} />} 
                         <div className="text-left leading-none">
                            TẢI NHẠC<br/><span className="text-[10px] opacity-70">(MP3)</span>
                         </div>
                      </div>
                      <div className="flex flex-col items-center justify-center px-2 py-1 bg-pink-500/20 rounded-lg border border-pink-500/20 ml-2">
                        <span className="text-[7px] font-black">AUDIO</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Copyright Warning Box - COMPACT */}
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3 text-yellow-500 font-sans shadow-lg">
                    <Info size={16} className="shrink-0 mt-0.5 opacity-60" />
                    <p className="text-[9px] font-bold leading-relaxed text-yellow-500/80 italic">
                      Lưu ý: Nếu file MP3 chỉ có 60 giây, đó là do TikTok giới hạn bản quyền nhạc gốc của nghệ sĩ. Hãy tải Video nếu muốn lấy đủ nhạc.
                    </p>
                  </div>
                </div>

                {/* Secondary Bottom Links - SMALLER */}
                <div className="grid grid-cols-2 gap-4 pt-5 mt-auto border-t border-white/5">
                   <button 
                      onClick={() => handleCopy(result.url, 'url')}
                      className="flex items-center justify-center gap-2.5 py-4 glass rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border-white/10 active:scale-95 group"
                   >
                      <Link size={16} className="text-cyan-400" />
                      LINK GỐC
                   </button>
                   <button 
                      onClick={() => handleCopy(result.videoUrl || '', 'dl')}
                      className="flex items-center justify-center gap-2.5 py-4 glass rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all border-white/10 active:scale-95 group"
                   >
                      <Copy size={16} className="text-pink-400" />
                      LINK TẢI
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending Slider Section */}
        {trending.length > 0 && (
          <section className="mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 relative">
            <div className="flex items-center justify-between mb-16">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-pink-500/10 rounded-3xl text-pink-500 border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                    <TrendingUp size={32} />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter filter drop-shadow-[0_0_10px_rgba(236,72,153,0.2)]">{t.trending}</h2>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => scrollTrending('left')} className="p-4 glass border-white/10 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all shadow-xl active:scale-90">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => scrollTrending('right')} className="p-4 glass border-white/10 rounded-2xl hover:bg-white/10 text-slate-400 hover:text-white transition-all shadow-xl active:scale-90">
                    <ChevronRight size={24} />
                  </button>
               </div>
            </div>

            <div 
              ref={trendingRef}
              className="flex overflow-x-auto gap-8 lg:gap-10 no-scrollbar scroll-smooth pb-10 px-4 -mx-4"
            >
              {trending.map((v, i) => (
                <div 
                  key={i} 
                  onClick={() => handleDownloadAction(v.url)}
                  className="group relative min-w-[280px] md:min-w-[0] md:flex-1 aspect-[9/16] rounded-[3.5rem] overflow-hidden cursor-pointer glass border-white/10 hover:neon-border-cyan transition-all duration-700 transform hover:-translate-y-4 shrink-0 shadow-2xl"
                >
                  <img src={v.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-8 flex flex-col justify-end">
                    <div className="space-y-4">
                       <p className="text-lg font-black line-clamp-2 italic uppercase text-white leading-tight filter drop-shadow-md">{v.title}</p>
                       <div className="flex items-center justify-between text-[11px] text-slate-400 font-black uppercase tracking-widest border-t border-white/10 pt-4">
                          <span className="truncate max-w-[100px]">{v.author}</span>
                          <span className="text-cyan-400 flex items-center gap-1.5"><Volume2 size={12} /> {v.views}</span>
                       </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center scale-50 group-hover:scale-100 transition-all duration-700 shadow-2xl border border-white/20">
                       <Play size={32} className="text-white fill-white ml-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Operational Steps */}
        <section className="mb-32">
          <div className="flex items-center gap-5 mb-20">
             <div className="w-3 h-12 bg-cyan-500 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse"></div>
             <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">{t.steps.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[t.steps.step1, t.steps.step2, t.steps.step3].map((step, i) => (
              <div key={i} className="glass p-12 rounded-[3.5rem] border-white/10 relative overflow-hidden group hover:bg-[#0f172a]/80 transition-all duration-700 shadow-2xl transform hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 blur-[80px] group-hover:bg-cyan-500/15 transition-all"></div>
                <div className="relative space-y-8">
                  <div className="text-8xl font-black text-cyan-500/10 italic leading-none group-hover:text-cyan-500/20 transition-all">0{i+1}</div>
                  <p className="text-2xl font-black italic uppercase leading-tight text-slate-100 tracking-tight group-hover:text-cyan-400 transition-colors">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History Interface */}
        {history.length > 0 && (
          <section className="mb-32">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-5">
                 <div className="w-3 h-12 bg-pink-500 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.6)] animate-pulse"></div>
                 <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">{t.history}</h2>
              </div>
              <button onClick={() => { setHistory([]); localStorage.removeItem('neontok_history'); }} className="px-6 py-3 glass rounded-2xl text-[11px] font-black text-slate-500 hover:text-red-400 flex items-center gap-3 uppercase tracking-[0.3em] transition-all border-white/10 hover:border-red-500/40 shadow-xl active:scale-95">
                <Trash2 size={18} /> CLEAN LOGS
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {history.map((item, idx) => (
                <div key={idx} onClick={() => handleDownloadAction(item.url)} className="glass p-7 rounded-[3rem] border-white/10 flex items-center gap-8 group hover:border-cyan-500/50 cursor-pointer transition-all duration-700 shadow-2xl overflow-hidden relative">
                  <div className="scanline opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative group/img">
                    <img src={item.cover} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                       <Play size={20} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="font-black text-2xl truncate uppercase italic group-hover:text-cyan-400 transition-colors leading-none tracking-tight">{item.title}</h4>
                    <span className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">{item.author}</span>
                  </div>
                  <div className="p-6 bg-white/5 rounded-[1.5rem] text-slate-600 group-hover:text-cyan-400 group-hover:bg-cyan-500/15 transition-all active:scale-90 shadow-lg">
                    <Download size={32} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="glass border-t border-white/5 py-32 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20 mb-24">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-[1.5rem] flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] rotate-3">
                <Gamepad2 className="text-white w-10 h-10" />
              </div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter filter drop-shadow-lg">
                <span className="text-cyan-400">NEON</span>
                <span className="text-pink-500">TOK</span>
              </h1>
            </div>
            
            <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-slate-600">
               <a href="https://kacestore.vercel.app" target="_blank" className="hover:text-cyan-400 transition-all hover:tracking-[0.6em]">SHOP KACESTORE</a>
               <a href="#" className="hover:text-cyan-400 transition-all hover:tracking-[0.6em]">PRIVACY CORE</a>
               <a href="#" className="hover:text-cyan-400 transition-all hover:tracking-[0.6em]">CONTACT OPS</a>
            </div>
          </div>
          <div className="text-center pt-16 border-t border-white/10 space-y-8">
             <p className="text-[12px] text-slate-600 font-sans tracking-[0.2em] max-w-4xl mx-auto uppercase leading-loose">
               POWERED BY THE KACESTORE GAMING ECOSYSTEM ENGINE.
             </p>
             <div className="flex items-center justify-center gap-4 text-pink-500/50 text-base font-black italic uppercase tracking-[0.3em]">
                <Heart size={20} fill="currentColor" className="animate-pulse" /> <span>Cyber-Crafted by KaceStore</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      </footer>
    </div>
  );
};

export default App;
