import React, { useState, useRef, useEffect } from 'react';
import { useServer } from '../../context/ServerContext';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Upload,
  Radio,
  Crosshair,
  ShieldAlert,
  FastForward,
  RotateCcw,
  Film,
  Zap,
} from 'lucide-react';

export const CombatVideoModal: React.FC = () => {
  const {
    isVideoModalOpen,
    setIsVideoModalOpen,
    switchMapRcon,
    showToast,
    uploadedVideoUrl,
    setUploadedVideoUrl,
  } = useServer();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [nightVision, setNightVision] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback timer simulation if native video metadata isn't available
  useEffect(() => {
    let interval: any;
    if (isVideoModalOpen && isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= duration) {
            return 0; // loop
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isVideoModalOpen, isPlaying, duration]);

  if (!isVideoModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
      setIsPlaying(true);
      showToast(`Loaded tactical video: ${file.name}`, 'success');
    }
  };

  const handleLaunchRaid = () => {
    switchMapRcon('3491029', 'ZOMBIE', 'Project Cerebrum: Cyber Brain Boss Raid');
    showToast('RCON: Switched server map to Project Cerebrum Raid!', 'success');
    setIsVideoModalOpen(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Synchronized radio comms transcript matching the video audio
  const getActiveTranscript = (time: number) => {
    if (time < 2.5) {
      return { speaker: 'ALPHA-1', text: 'Engaging biomechanical entity in Sector 4 hangar! Keep firing!' };
    } else if (time < 4.8) {
      return { speaker: 'BRAVO-2', text: 'Target the brain! It is retaliating! Take cover!' };
    } else if (time < 6.8) {
      return { speaker: 'FIRETEAM', text: 'Heavy rotary minigun fire! Barricades disintegrating! Stay down!' };
    } else if (time < 8.8) {
      return { speaker: 'CHARLIE-4', text: 'Direct hit on cerebral core! Secondary detonations confirmed!' };
    } else {
      return { speaker: 'SQUAD LEADER', text: 'Target eliminated! Good job team, we did it!' };
    }
  };

  const currentComms = getActiveTranscript(playbackTime);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#181A20] border border-[#383F4D] rounded-xl max-w-5xl w-full shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-3.5 bg-[#111317] border-b border-[#2E3440] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase font-mono-code text-white">
                  Tactical Operation Footage & Briefing
                </span>
                <span className="text-[10px] font-mono-code bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                  SECTOR-4 BOSS RAID
                </span>
              </div>
              <span className="text-[11px] font-mono-code text-[#88929B]">
                Project Cerebrum: Cybernetic Brain Spider Entity (UGC 3491029)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Custom Video File Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-mono-code rounded transition-colors"
              title="Upload / replace with your video file"
            >
              <Upload className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span className="hidden sm:inline">Load Video File</span>
            </button>

            {/* Close */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="text-[#88929B] hover:text-white p-1 rounded hover:bg-[#222630] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player & HUD Screen */}
        <div className="relative aspect-video bg-[#0A0B0E] overflow-hidden flex items-center justify-center shrink-0">
          {uploadedVideoUrl ? (
            <video
              ref={videoRef}
              src={uploadedVideoUrl}
              autoPlay
              loop
              playsInline
              onTimeUpdate={(e) => setPlaybackTime(+(e.currentTarget.currentTime).toFixed(1))}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 10)}
              className={`w-full h-full object-contain ${nightVision ? 'contrast-150 saturate-50 hue-rotate-90' : ''}`}
            />
          ) : (
            /* Cinematic Tactical Stream Fallback Scene matching user's video */
            <div className="relative w-full h-full bg-[#0d0f13] flex flex-col items-center justify-center overflow-hidden">
              {/* Background Hangar Illustration / Video poster */}
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"
                alt="Tactical Hangar Raid"
                className={`w-full h-full object-cover opacity-75 ${nightVision ? 'filter contrast-150 hue-rotate-90 saturate-50' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

              {/* Dynamic Action Animation Simulation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/70 backdrop-blur-md border border-[#EF4444] text-[#EF4444] text-xs font-mono-code font-bold uppercase tracking-wider mb-2 animate-pulse">
                  <ShieldAlert className="w-4 h-4" />
                  Target: Giant Cybernetic Brain Spider Boss
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-md">
                  &quot;Target the brain! It is retaliating! Take cover!&quot;
                </h3>
                <p className="text-xs text-[#E2E2E8] font-mono-code mt-1 max-w-lg drop-shadow">
                  Sector 4 industrial warehouse breach · 4-Operator PVE Raid · Minigun barrage suppression
                </p>
              </div>
            </div>
          )}

          {/* Tactical HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between z-20">
            {/* Top HUD Line */}
            <div className="flex items-center justify-between text-[11px] font-mono-code">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
                <span className="text-[#EF4444] font-bold">REC</span>
                <span className="text-white font-semibold">00:0{Math.floor(playbackTime)}.{Math.floor((playbackTime % 1) * 10)}</span>
                <span className="text-[#88929B]">/ 00:09.9</span>
              </div>

              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10">
                <span className="text-[#38BDF8]">CAM 04 [OPERATOR HELMET]</span>
                <span className="text-[#22C55E]">FPS: 90</span>
              </div>
            </div>

            {/* Target Reticle in Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-80 pointer-events-none">
              <Crosshair className="w-16 h-16 text-[#EF4444] animate-pulse stroke-[1.5]" />
              <div className="text-[10px] font-mono-code text-[#EF4444] font-bold bg-black/70 px-2 py-0.5 rounded border border-[#EF4444]/40 mt-1">
                WEAKSPOT: CEREBRAL NODE
              </div>
            </div>

            {/* Bottom Subtitle / Radio Transcript Banner */}
            <div className="bg-black/75 backdrop-blur-md border border-[#383F4D] rounded-lg p-3 text-center pointer-events-auto max-w-xl mx-auto w-full">
              <div className="text-[10px] uppercase font-mono-code text-[#F59E0B] font-bold tracking-wider mb-0.5 flex items-center justify-center gap-1.5">
                <Radio className="w-3 h-3 text-[#F59E0B] animate-pulse" />
                COMMS INTERCEPT: [{currentComms.speaker}]
              </div>
              <div className="text-sm font-semibold text-white tracking-wide">
                &quot;{currentComms.text}&quot;
              </div>
            </div>
          </div>

          {/* Video Control Bar */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-30 opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/10">
              <button
                onClick={togglePlay}
                className="text-white hover:text-[#0EA5E9] p-1 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="text-white hover:text-[#0EA5E9] p-1 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setNightVision(!nightVision)}
                className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded border transition-colors ${
                  nightVision ? 'bg-[#22C55E]/30 text-[#22C55E] border-[#22C55E]' : 'bg-[#181A20] text-[#88929B] border-[#2E3440]'
                }`}
                title="Toggle NVG Filter"
              >
                NVG
              </button>
            </div>

            <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono-code text-[#88929B]">
              Video Upload Support: <button onClick={() => fileInputRef.current?.click()} className="text-[#38BDF8] hover:underline font-bold">Select Local File</button>
            </div>
          </div>
        </div>

        {/* Bottom Details & Direct RCON Action */}
        <div className="p-4 bg-[#111317] border-t border-[#2E3440] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 overflow-y-auto">
          {/* Boss Encounter Stats */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">Project Cerebrum: Boss Raid Phase 1</span>
              <span className="text-[11px] font-mono-code text-[#0EA5E9]">mod.io UGC 3491029</span>
              <span className="text-[10px] font-mono-code bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-1.5 py-0.2 rounded font-semibold">
                PVE 4-Player Co-op
              </span>
            </div>
            <div className="text-xs text-[#88929B] font-mono-code flex items-center gap-2 flex-wrap">
              <span>Armor: Heavy Plating</span>
              <span aria-hidden="true">·</span>
              <span>Minigun DPS: 450</span>
              <span aria-hidden="true">·</span>
              <span>Weakpoint: Exposed Brain (3x Damage)</span>
            </div>
          </div>

          {/* Quick RCON Launch Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText('SwitchMap UGC3491029 ZOMBIE');
                showToast('Copied RCON: SwitchMap UGC3491029 ZOMBIE', 'info');
              }}
              className="px-3 py-2 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] text-xs font-mono-code text-[#E2E2E8] rounded transition-colors"
            >
              Copy RCON Command
            </button>

            <button
              onClick={handleLaunchRaid}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Boss Raid via RCON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
