import React, { useState } from 'react';
import { ModioMod } from '../types';
import { useServer } from '../context/ServerContext';
import {
  Download,
  RefreshCw,
  Copy,
  Check,
  Layers,
  ChevronRight,
  ThumbsUp,
  ExternalLink,
} from 'lucide-react';

interface ModCardProps {
  mod: ModioMod;
  isSelected: boolean;
  onSelect: () => void;
  onInspect: () => void;
}

export const ModCard: React.FC<ModCardProps> = ({
  mod,
  isSelected,
  onSelect,
  onInspect,
}) => {
  const { installMod, updateMod, showToast, addMapToCycle } = useServer();
  const [copiedUgc, setCopiedUgc] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopyUgc = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(mod.ugcId);
    setCopiedUgc(true);
    showToast(`Copied mod.io UGC ID ${mod.ugcId} to clipboard`, 'info');
    setTimeout(() => setCopiedUgc(false), 2000);
  };

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mod.status === 'not_installed') {
      installMod(mod.id);
    } else if (mod.status === 'update_available') {
      updateMod(mod.id);
    }
  };

  const handleAddToCycle = (e: React.MouseEvent) => {
    e.stopPropagation();
    addMapToCycle(mod.ugcId, mod.title, mod.gameMode);
  };

  return (
    <div
      onClick={onInspect}
      className={`group relative bg-[#181A20] border rounded transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-[#0EA5E9] ring-1 ring-[#0EA5E9] bg-[#1A222C]'
          : 'border-[#2E3440] hover:border-[#383F4D] hover:bg-[#1C1F26]'
      }`}
    >
      {/* Top 16:9 Thumbnail Image */}
      <div className="relative aspect-video w-full bg-[#0F1115] overflow-hidden">
        {!imageError ? (
          <img
            src={mod.imageUrl}
            alt={mod.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#181A20] via-[#222630] to-[#0F1115] flex flex-col items-center justify-center p-4 text-center">
            <Layers className="w-8 h-8 text-[#0EA5E9] mb-1.5 opacity-60" />
            <span className="text-xs font-mono-code text-[#88929B] font-semibold">{mod.category.toUpperCase()}</span>
          </div>
        )}

        {/* Gradient Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-black/30 to-transparent pointer-events-none" />

        {/* Top Floating Controls: Batch Selection Checkbox + mod.io Monospace Badge */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {/* 16x16 Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`w-4 h-4 rounded-[2px] border transition-colors flex items-center justify-center ${
              isSelected
                ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                : 'bg-[#0F1115]/90 border-[#2E3440] hover:border-[#0EA5E9]'
            }`}
            title="Select for batch operations"
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          {/* mod.io UGC ID Pill with Copy on Click */}
          <button
            type="button"
            onClick={handleCopyUgc}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#0F1115]/85 backdrop-blur-sm border border-[#2E3440] hover:border-[#0EA5E9] text-[#94A3B8] hover:text-white text-[11px] font-mono-code transition-colors"
            title="Click to copy mod.io UGC ID"
          >
            {copiedUgc ? (
              <Check className="w-2.5 h-2.5 text-[#22C55E]" />
            ) : (
              <Copy className="w-2.5 h-2.5 opacity-70" />
            )}
            <span>mod.io {mod.ugcId}</span>
          </button>
        </div>

        {/* Hover Quick Action Utility Icons Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
          {mod.status !== 'installed' && (
            <button
              onClick={handleInstallClick}
              className="p-2 rounded bg-[#0EA5E9] text-white hover:bg-[#38BDF8] transition-colors"
              title={mod.status === 'update_available' ? 'Update Package' : 'Download Package'}
            >
              {mod.status === 'update_available' ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          )}

          {mod.isCustomMap && (
            <button
              onClick={handleAddToCycle}
              className="p-2 rounded bg-[#222630] text-white hover:bg-[#2A303C] border border-[#383F4D] transition-colors"
              title="Add to RCON Map Rotation Cycle"
            >
              <Layers className="w-4 h-4 text-[#38BDF8]" />
            </button>
          )}

          <a
            href={mod.modioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded bg-[#222630] text-white hover:bg-[#2A303C] border border-[#383F4D] transition-colors"
            title="View on mod.io"
          >
            <ExternalLink className="w-4 h-4 text-[#88929B]" />
          </a>
        </div>

        {/* Simulated Download Progress Bar */}
        {mod.isDownloading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F1115]">
            <div
              className="h-full bg-[#0EA5E9] transition-all duration-300"
              style={{ width: `${mod.downloadProgress || 50}%` }}
            />
          </div>
        )}
      </div>

      {/* Meta Body & Footer */}
      <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-xs font-semibold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1"
              title={mod.title}
            >
              {mod.title}
            </h3>
            {mod.status === 'installed' && (
              <span className="text-[10px] font-mono-code font-semibold text-[#22C55E] flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Mounted
              </span>
            )}
            {mod.status === 'update_available' && (
              <span className="text-[10px] font-mono-code font-semibold text-[#F59E0B] flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                Update Avail
              </span>
            )}
            {mod.status === 'not_installed' && (
              <span className="text-[10px] font-mono-code text-[#88929B] shrink-0">
                mod.io Hub
              </span>
            )}
          </div>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#88929B] mt-1 font-mono-code flex-wrap">
            <span className="text-[#E2E2E8] font-semibold">{mod.gameMode}</span>
            <span aria-hidden="true">·</span>
            <span>{mod.fileSizeFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>v{mod.version}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[90px]">by {mod.author}</span>
          </div>

          <p className="text-[11px] text-[#88929B] line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {mod.description}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 border-t border-[#2E3440]/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono-code text-[#88929B]">
            <span className="flex items-center gap-1 text-[#22C55E]">
              <ThumbsUp className="w-3 h-3" />
              {mod.ratingPercentage}%
            </span>
            <span aria-hidden="true">·</span>
            <span>{(mod.downloads / 1000).toFixed(0)}k DL</span>
          </div>

          <div className="flex items-center gap-1.5">
            {mod.status === 'update_available' && (
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={mod.isDownloading}
                className="flex items-center gap-1 px-2 py-1 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-[11px] font-mono-code font-semibold rounded transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${mod.isDownloading ? 'animate-spin' : ''}`} />
                <span>Update</span>
              </button>
            )}

            {mod.status === 'not_installed' && (
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={mod.isDownloading}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-[11px] font-semibold rounded transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Install</span>
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInspect();
              }}
              className="flex items-center gap-0.5 px-2 py-1 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-[11px] font-medium rounded transition-colors"
              title="Inspect mod.io package details"
            >
              <span>Inspect</span>
              <ChevronRight className="w-3 h-3 text-[#88929B]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
