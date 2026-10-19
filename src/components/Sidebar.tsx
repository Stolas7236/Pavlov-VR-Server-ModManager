import React from 'react';
import { useServer } from '../context/ServerContext';
import {
  Server,
  Activity,
  Users,
  HardDrive,
  Cpu,
  MapPin,
  FastForward,
  Megaphone,
  UserX,
  RotateCcw,
  Sliders,
  Compass,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    servers,
    activeServer,
    selectServer,
    players,
    triggerRconNextMap,
    sendRconCommand,
    setIsBroadcastModalOpen,
    setIsKickBanModalOpen,
    resetToDefaults,
    setActiveTab,
    mapCycle,
    activeRotationIndex,
    openVideoBriefing,
  } = useServer();

  const diskPercentage = Math.round((activeServer.modDiskUsageGb / activeServer.totalDiskGb) * 100);
  const playerPercentage = Math.round((players.length / activeServer.maxPlayers) * 100);
  const activeCycleItems = mapCycle.filter((m) => m.enabled);

  return (
    <aside className="w-64 bg-[#111317] border-r border-[#2E3440] flex flex-col justify-between select-none shrink-0 overflow-y-auto">
      {/* Top: Server Profile Selector & Real-Time Telemetry */}
      <div className="p-4 space-y-4">
        {/* Server Switcher */}
        <div>
          <label className="text-[10px] uppercase font-mono-code text-[#88929B] font-semibold tracking-wider block mb-1.5">
            Dedicated Server Instance
          </label>
          <div className="relative">
            <select
              value={activeServer.id}
              onChange={(e) => selectServer(e.target.value)}
              className="w-full bg-[#181A20] border border-[#2E3440] hover:border-[#383F4D] focus:border-[#0EA5E9] rounded p-2 text-xs text-[#E2E2E8] font-medium appearance-none cursor-pointer pr-8 transition-colors"
            >
              {servers.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#181A20] text-white">
                  {s.name}
                </option>
              ))}
            </select>
            <Server className="w-3.5 h-3.5 text-[#88929B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono-code text-[#88929B] mt-1.5 px-0.5">
            <span>{activeServer.region}</span>
            <span>{activeServer.ip}:{activeServer.port}</span>
          </div>
        </div>

        {/* Live RCON Heartbeat Panel */}
        <div className="bg-[#181A20] border border-[#2E3440] rounded p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono-code text-[#88929B] font-bold">
              RCON Socket
            </span>
            <span
              className={`text-[11px] font-mono-code font-semibold flex items-center gap-1.5 ${
                activeServer.rconStatus === 'online' ? 'text-[#22C55E]' : 'text-[#EF4444]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeServer.rconStatus === 'online' ? 'bg-[#22C55E] animate-pulse' : 'bg-[#EF4444]'
                }`}
              />
              {activeServer.rconStatus === 'online' ? 'LINKED (18ms)' : 'OFFLINE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2E3440]/60">
            <div>
              <span className="text-[10px] font-mono-code text-[#88929B] block">Tickrate</span>
              <span className="text-xs font-mono-code font-bold text-[#E2E2E8] flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#22C55E]" />
                {activeServer.tickRate} Hz
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#88929B] block">Active Mode</span>
              <span className="text-xs font-mono-code font-bold text-[#0EA5E9]">
                {activeServer.currentGameMode}
              </span>
            </div>
          </div>
        </div>

        {/* Current Active Map & Players */}
        <div className="bg-[#181A20] border border-[#2E3440] rounded p-3 space-y-3">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono-code text-[#88929B] mb-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0EA5E9]" />
                Current Map
              </span>
              <span className="text-[#0EA5E9] cursor-pointer hover:underline" onClick={() => setActiveTab('mapcycle')}>
                mod.io {activeServer.currentMapUgc}
              </span>
            </div>
            <div className="text-xs font-semibold text-white truncate" title={activeServer.currentMapTitle}>
              {activeServer.currentMapTitle}
            </div>
            <div className="text-[11px] font-mono-code text-[#88929B] mt-0.5 flex items-center justify-between">
              <span>Time: {activeServer.elapsedTime}</span>
              {activeCycleItems.length > 0 && (
                <span className="text-[#38BDF8]">
                  Queue #{activeRotationIndex + 1}/{activeCycleItems.length}
                </span>
              )}
            </div>
          </div>

          {/* Player Capacity Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
              <span className="text-[#88929B] flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0EA5E9]" />
                Roster
              </span>
              <span className="text-[#E2E2E8] font-bold">
                {players.length} / {activeServer.maxPlayers}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#0F1115] rounded-full overflow-hidden border border-[#2E3440]">
              <div
                className="h-full bg-[#0EA5E9] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(playerPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* mod.io Storage Disk Gauge */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono-code mb-1">
              <span className="text-[#88929B] flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-[#38BDF8]" />
                mod.io Cache
              </span>
              <span className="text-[#E2E2E8]">
                {activeServer.modDiskUsageGb} GB / {activeServer.totalDiskGb} GB
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#0F1115] rounded-full overflow-hidden border border-[#2E3440]">
              <div
                className="h-full bg-[#38BDF8] rounded-full transition-all duration-300"
                style={{ width: `${diskPercentage}%` }}
              />
            </div>
          </div>

          {/* Allocated RAM */}
          <div className="flex items-center justify-between text-[11px] font-mono-code text-[#88929B] pt-1 border-t border-[#2E3440]/60">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#22C55E]" />
              Allocated RAM
            </span>
            <span className="text-[#E2E2E8] font-semibold">
              {activeServer.allocatedRamMb.toLocaleString()} MB
            </span>
          </div>

          {/* Live Tactical Video Cam Mini-Feed */}
          <div
            onClick={() => openVideoBriefing()}
            className="group relative rounded overflow-hidden border border-[#EF4444]/40 hover:border-[#EF4444] bg-[#0A0B0E] cursor-pointer p-2 transition-all"
            title="Click to expand full Tactical Boss Raid combat footage"
          >
            <div className="flex items-center justify-between text-[10px] font-mono-code mb-1">
              <span className="text-[#EF4444] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                COMBAT FEED [CAM-04]
              </span>
              <span className="text-[#88929B] group-hover:text-white">WATCH &gt;</span>
            </div>
            <div className="relative aspect-video rounded overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80"
                alt="Cyber Brain Boss Raid"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-mono-code text-white">
                <span className="font-bold text-[#EF4444]">BOSS: CEREBRUM</span>
                <span>00:09 REC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tactical RCON Action Controls */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-mono-code text-[#88929B] font-semibold tracking-wider block mb-1">
            Tactical RCON Directives
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={triggerRconNextMap}
              className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-medium rounded transition-colors text-center"
              title="Immediately rotate to next map via RCON SwitchMap"
            >
              <FastForward className="w-3 h-3 text-[#0EA5E9]" />
              <span>Next Map</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-medium rounded transition-colors text-center"
              title="Broadcast server announcement message"
            >
              <Megaphone className="w-3 h-3 text-[#F59E0B]" />
              <span>Broadcast</span>
            </button>

            <button
              onClick={() => setIsKickBanModalOpen(true)}
              className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-medium rounded transition-colors text-center"
              title="Open player moderation & enforcement modal"
            >
              <UserX className="w-3 h-3 text-[#EF4444]" />
              <span>Moderate</span>
            </button>

            <button
              onClick={() => sendRconCommand('ResetSND')}
              className="flex items-center justify-center gap-1.5 px-2 py-2 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs font-medium rounded transition-colors text-center"
              title="Reset match scores and round clock"
            >
              <RotateCcw className="w-3 h-3 text-[#22C55E]" />
              <span>Reset SND</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Utility Controls */}
      <div className="p-4 border-t border-[#2E3440] space-y-2 bg-[#0F1115]">
        <button
          onClick={() => setActiveTab('mapcycle')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-xs font-medium text-[#0EA5E9] rounded transition-colors"
        >
          <FastForward className="w-3.5 h-3.5 text-[#0EA5E9]" />
          <span>RCON Map Rotation Queue</span>
        </button>

        <button
          onClick={resetToDefaults}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-[11px] font-mono-code text-[#88929B] hover:text-[#E2E2E8] transition-colors"
          title="Reset local state back to initial Pavlov VR preset"
        >
          <Compass className="w-3 h-3" />
          <span>Restore Default Presets</span>
        </button>
      </div>
    </aside>
  );
};
