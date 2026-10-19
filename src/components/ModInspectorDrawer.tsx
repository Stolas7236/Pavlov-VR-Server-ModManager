import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import {
  X,
  Copy,
  Check,
  Play,
  Layers,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldAlert,
  FileCode,
  HardDrive,
  Calendar,
  ThumbsUp,
  Download,
} from 'lucide-react';

interface ModInspectorDrawerProps {
  onClose: () => void;
}

export const ModInspectorDrawer: React.FC<ModInspectorDrawerProps> = ({ onClose }) => {
  const {
    mods,
    selectedModId,
    installMod,
    updateMod,
    uninstallMod,
    switchMapRcon,
    addMapToCycle,
    showToast,
    openVideoBriefing,
  } = useServer();

  const [copiedUgc, setCopiedUgc] = useState(false);
  const [copiedIni, setCopiedIni] = useState(false);

  const mod = mods.find((m) => m.id === selectedModId);

  if (!mod) return null;

  const iniString = `MapRotation=(MapId="UGC${mod.ugcId}", GameMode="${mod.gameMode}")`;

  const handleCopyUgc = () => {
    navigator.clipboard.writeText(mod.ugcId);
    setCopiedUgc(true);
    showToast(`Copied mod.io UGC ID ${mod.ugcId}`, 'info');
    setTimeout(() => setCopiedUgc(false), 2000);
  };

  const handleCopyIni = () => {
    navigator.clipboard.writeText(iniString);
    setCopiedIni(true);
    showToast('Copied Game.ini rotation syntax to clipboard', 'success');
    setTimeout(() => setCopiedIni(false), 2000);
  };

  const handleLaunchMap = () => {
    switchMapRcon(mod.ugcId, mod.gameMode, mod.title);
    showToast(`Dispatched RCON SwitchMap UGC${mod.ugcId} (${mod.gameMode})`, 'success');
  };

  return (
    <aside className="w-[340px] bg-[#181A20] border-l border-[#2E3440] flex flex-col justify-between shrink-0 h-full overflow-y-auto z-20 shadow-2xl shadow-black/80">
      {/* Header */}
      <div className="p-4 border-b border-[#2E3440] flex items-center justify-between bg-[#111317]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono-code font-bold text-[#0EA5E9] tracking-wider">
            mod.io Asset Inspector
          </span>
          <span className="text-[11px] font-mono-code text-[#88929B]">
            UGC {mod.ugcId}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#88929B] hover:text-white p-1 rounded hover:bg-[#222630] transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 flex-1">
        {/* Cover Image & UGC Header */}
        <div className="relative aspect-video rounded overflow-hidden border border-[#2E3440] bg-[#0F1115]">
          <img
            src={mod.imageUrl}
            alt={mod.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="text-xs font-mono-code font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
              {mod.gameMode}
            </span>
            <span
              className={`text-[10px] font-mono-code font-semibold px-2 py-0.5 rounded ${
                mod.status === 'installed'
                  ? 'bg-[#22C55E]/20 text-[#22C55E]'
                  : mod.status === 'update_available'
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                  : 'bg-[#88929B]/20 text-[#88929B]'
              }`}
            >
              {mod.status === 'installed'
                ? 'Mounted v' + mod.version
                : mod.status === 'update_available'
                ? 'Update to v' + mod.latestVersion
                : 'Not Installed'}
            </span>
          </div>
        </div>

        {/* Title & Author */}
        <div>
          <h2 className="text-sm font-bold text-white leading-snug">{mod.title}</h2>
          <div className="flex items-center gap-2 text-xs text-[#88929B] font-mono-code mt-1">
            <span>Author: {mod.author}</span>
            <span aria-hidden="true">·</span>
            <a
              href={mod.modioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0EA5E9] hover:underline flex items-center gap-0.5"
            >
              <span>mod.io</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* mod.io UGC ID Quick Copy Box */}
        <div className="bg-[#0F1115] border border-[#2E3440] rounded p-2.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono-code text-[#88929B] block">mod.io Item UGC ID</span>
            <span className="text-xs font-mono-code font-bold text-white">UGC {mod.ugcId}</span>
          </div>
          <button
            onClick={handleCopyUgc}
            className="flex items-center gap-1 px-2 py-1 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-[#E2E2E8] text-xs font-mono-code rounded transition-colors"
          >
            {copiedUgc ? <Check className="w-3 h-3 text-[#22C55E]" /> : <Copy className="w-3 h-3 text-[#0EA5E9]" />}
            <span>{copiedUgc ? 'Copied' : 'Copy ID'}</span>
          </button>
        </div>

        {/* Technical Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
          <div className="bg-[#0F1115] border border-[#2E3440] rounded p-2">
            <span className="text-[10px] text-[#88929B] flex items-center gap-1 mb-0.5">
              <HardDrive className="w-3 h-3 text-[#38BDF8]" />
              File Size
            </span>
            <span className="text-white font-semibold">{mod.fileSizeFormatted}</span>
          </div>
          <div className="bg-[#0F1115] border border-[#2E3440] rounded p-2">
            <span className="text-[10px] text-[#88929B] flex items-center gap-1 mb-0.5">
              <ThumbsUp className="w-3 h-3 text-[#22C55E]" />
              Rating
            </span>
            <span className="text-white font-semibold">{mod.ratingPercentage}% Positive</span>
          </div>
          <div className="bg-[#0F1115] border border-[#2E3440] rounded p-2">
            <span className="text-[10px] text-[#88929B] flex items-center gap-1 mb-0.5">
              <Download className="w-3 h-3 text-[#0EA5E9]" />
              Downloads
            </span>
            <span className="text-white font-semibold">{mod.downloads.toLocaleString()}</span>
          </div>
          <div className="bg-[#0F1115] border border-[#2E3440] rounded p-2">
            <span className="text-[10px] text-[#88929B] flex items-center gap-1 mb-0.5">
              <Calendar className="w-3 h-3 text-[#F59E0B]" />
              Last Updated
            </span>
            <span className="text-white">{mod.lastUpdated}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <span className="text-[10px] uppercase font-mono-code text-[#88929B] font-semibold block mb-1">
            Package Description
          </span>
          <p className="text-xs text-[#bec8d2] leading-relaxed bg-[#0F1115] border border-[#2E3440] rounded p-2.5">
            {mod.description}
          </p>
        </div>

        {/* Dependencies */}
        <div>
          <span className="text-[10px] uppercase font-mono-code text-[#88929B] font-semibold block mb-1">
            mod.io Dependencies
          </span>
          {mod.dependencies.length > 0 ? (
            <div className="space-y-1">
              {mod.dependencies.map((dep, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs font-mono-code text-[#38BDF8] bg-[#0F1115] border border-[#2E3440] px-2 py-1 rounded"
                >
                  <Layers className="w-3 h-3 shrink-0" />
                  <span className="truncate">{dep}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-[#88929B] font-mono-code bg-[#0F1115] border border-[#2E3440] p-2 rounded">
              Zero external dependencies required.
            </div>
          )}
        </div>

        {/* Game.ini Configuration Generator */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-mono-code text-[#88929B] font-semibold flex items-center gap-1">
              <FileCode className="w-3 h-3 text-[#0EA5E9]" />
              Game.ini MapRotation Syntax
            </span>
            <button
              onClick={handleCopyIni}
              className="text-[10px] font-mono-code text-[#0EA5E9] hover:underline flex items-center gap-0.5"
            >
              {copiedIni ? <Check className="w-2.5 h-2.5 text-[#22C55E]" /> : <Copy className="w-2.5 h-2.5" />}
              <span>{copiedIni ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="bg-[#0A0B0E] border border-[#2E3440] p-2 rounded text-[11px] font-mono-code text-[#38BDF8] break-all select-all">
            {iniString}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-[#2E3440] bg-[#111317] space-y-2">
        {/* Watch Combat Footage Briefing */}
        <button
          onClick={() => openVideoBriefing()}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#EF4444] hover:text-white text-xs font-mono-code font-semibold rounded transition-colors shadow-sm shadow-[#EF4444]/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
          <span>Watch Tactical Combat Footage</span>
        </button>

        {/* Direct RCON SwitchMap */}
        {mod.isCustomMap && (
          <button
            onClick={handleLaunchMap}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Switch Map via RCON (Immediate)</span>
          </button>
        )}

        {/* Add to RCON Map Cycle */}
        {mod.isCustomMap && (
          <button
            onClick={() => addMapToCycle(mod.ugcId, mod.title, mod.gameMode)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-medium rounded transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Add to RCON Rotation Queue</span>
          </button>
        )}

        {/* Update / Install Button */}
        {mod.status === 'update_available' && (
          <button
            onClick={() => updateMod(mod.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-mono-code font-semibold rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync to Latest mod.io Version</span>
          </button>
        )}

        {mod.status === 'not_installed' && (
          <button
            onClick={() => installMod(mod.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Download & Mount mod.io Package</span>
          </button>
        )}

        {/* Uninstall Mod */}
        {mod.status !== 'not_installed' && (
          <button
            onClick={() => uninstallMod(mod.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-transparent hover:bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Uninstall from Mod Cache</span>
          </button>
        )}
      </div>
    </aside>
  );
};
