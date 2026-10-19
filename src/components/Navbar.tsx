import React from 'react';
import { useServer } from '../context/ServerContext';
import { ActiveNavTab } from '../types';
import { RefreshCw, Plus, Radio, Server } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    mods,
    syncAllOutdatedMods,
    isSyncingAll,
    setIsAddModModalOpen,
    activeServer,
    toggleRconConnection,
    openVideoBriefing,
  } = useServer();

  const outdatedCount = mods.filter((m) => m.status === 'update_available').length;

  const navItems: { id: ActiveNavTab; label: string }[] = [
    { id: 'mods', label: 'mod.io Assets' },
    { id: 'rcon', label: 'RCON Terminal' },
    { id: 'mapcycle', label: 'RCON Map Cycle' },
    { id: 'config', label: 'Server Config' },
  ];

  return (
    <header className="h-14 bg-[#111317] border-b border-[#2E3440] px-5 flex items-center justify-between gap-8 select-none shrink-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded bg-[#181A20] border border-[#2E3440] flex items-center justify-center text-[#0EA5E9]">
          <Server className="w-4 h-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-sm tracking-wider uppercase text-white font-mono-code">
            PAVLOV<span className="text-[#0EA5E9]">·</span>RCON
          </span>
          <span className="text-[11px] font-mono-code text-[#00A572] bg-[#00A572]/15 border border-[#00A572]/30 px-1.5 py-0.5 rounded hidden sm:inline">
            mod.io API
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-1.5 transition-colors whitespace-nowrap shrink-0 relative ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-[#88929B] hover:text-[#E2E2E8]'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0EA5E9] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Combat Cam / Tactical Video Briefing button */}
        <button
          onClick={() => openVideoBriefing()}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono-code font-semibold bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#EF4444] hover:text-white transition-all shadow-sm shadow-[#EF4444]/10"
          title="Watch Sector 4 Tactical Combat Video & Boss Raid Footage"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
          <span>Combat Cam</span>
        </button>

        {/* RCON Status indicator button */}
        <button
          onClick={toggleRconConnection}
          title={activeServer.rconStatus === 'online' ? 'Click to toggle RCON offline' : 'Click to connect RCON'}
          className={`flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-mono-code border transition-colors ${
            activeServer.rconStatus === 'online'
              ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#22C55E] hover:bg-[#10B981]/20'
              : 'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/20'
          }`}
        >
          <Radio className={`w-3 h-3 ${activeServer.rconStatus === 'online' ? 'animate-pulse' : ''}`} />
          <span className="uppercase">{activeServer.rconStatus === 'online' ? 'RCON LIVE' : 'RCON OFF'}</span>
        </button>

        {/* Sync Outdated Mods CTA */}
        {outdatedCount > 0 ? (
          <button
            onClick={syncAllOutdatedMods}
            disabled={isSyncingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] active:scale-[0.98] text-white text-xs font-semibold rounded transition-all whitespace-nowrap shadow-sm shadow-[#0EA5E9]/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>Sync mod.io ({outdatedCount})</span>
          </button>
        ) : (
          <button
            onClick={syncAllOutdatedMods}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#222630] hover:bg-[#282E3A] border border-[#2E3440] text-[#E2E2E8] text-xs font-medium rounded transition-all whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>mod.io Synced</span>
          </button>
        )}

        {/* Add mod.io Mod CTA */}
        <button
          onClick={() => setIsAddModModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-white text-xs font-semibold rounded transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>+ Add mod.io</span>
        </button>
      </div>
    </header>
  );
};
