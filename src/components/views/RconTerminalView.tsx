import React, { useState, useRef, useEffect } from 'react';
import { useServer } from '../../context/ServerContext';
import { ServerPlayer, LogSeverity } from '../../types';
import {
  Terminal,
  Send,
  Trash2,
  Lock,
  Unlock,
  Users,
  UserX,
  VolumeX,
  Volume2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const RconTerminalView: React.FC = () => {
  const {
    logs,
    players,
    activeServer,
    sendRconCommand,
    setTargetPlayerForKick,
    setIsKickBanModalOpen,
    showToast,
  } = useServer();

  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [logFilter, setLogFilter] = useState<'all' | 'rcon' | 'player' | 'warn'>('all');
  const [playerSearch, setPlayerSearch] = useState('');

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new log entries
  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim();
    sendRconCommand(cmd);
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex =
        historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputCommand('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCommand(commandHistory[nextIndex] || '');
      }
    }
  };

  const handleInjectCommand = (cmdText: string) => {
    setInputCommand(cmdText);
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'rcon') return log.severity === 'rcon';
    if (logFilter === 'player') return log.severity === 'player';
    if (logFilter === 'warn') return log.severity === 'warn' || log.severity === 'error';
    return true;
  });

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.steamId.includes(playerSearch)
  );

  const getLogSeverityColor = (severity: LogSeverity) => {
    switch (severity) {
      case 'rcon':
        return 'text-[#0EA5E9]';
      case 'sync':
        return 'text-[#22C55E]';
      case 'player':
        return 'text-[#38BDF8]';
      case 'warn':
        return 'text-[#F59E0B]';
      case 'error':
        return 'text-[#EF4444]';
      default:
        return 'text-[#E2E2E8]';
    }
  };

  const commonCommands = [
    { label: 'RotateMap', cmd: 'RotateMap' },
    { label: 'SwitchMap Sandstorm', cmd: 'SwitchMap UGC1849201 SND' },
    { label: 'SwitchMap Stalingrad', cmd: 'SwitchMap UGC2940194 PUSH' },
    { label: 'ResetSND', cmd: 'ResetSND' },
    { label: 'ServerInfo', cmd: 'ServerInfo' },
    { label: 'Broadcast Warmup', cmd: 'Broadcast Warmup round ending in 30 seconds!' },
  ];

  return (
    <div className="flex-1 flex flex-col xl:flex-row h-full overflow-hidden bg-[#0F1115]">
      {/* Left / Upper: Live RCON Command Terminal */}
      <div className="flex-1 flex flex-col h-full border-r border-[#2E3440] overflow-hidden">
        {/* Terminal Header & Filter Bar */}
        <div className="p-3.5 bg-[#111317] border-b border-[#2E3440] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#181A20] border border-[#2E3440] text-[#0EA5E9]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase font-mono-code text-white">
                  Live RCON Protocol Stream
                </span>
                <span className="text-[10px] font-mono-code text-[#88929B]">
                  {activeServer.ip}:{activeServer.rconPort}
                </span>
              </div>
              <span className="text-[11px] font-mono-code text-[#22C55E] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Socket Active · {logs.length} Packets Received
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 bg-[#181A20] p-0.5 rounded border border-[#2E3440] text-[11px] font-mono-code">
              <button
                onClick={() => setLogFilter('all')}
                className={`px-2 py-1 rounded transition-colors ${
                  logFilter === 'all' ? 'bg-[#222630] text-white font-semibold' : 'text-[#88929B] hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setLogFilter('rcon')}
                className={`px-2 py-1 rounded transition-colors ${
                  logFilter === 'rcon' ? 'bg-[#222630] text-[#0EA5E9] font-semibold' : 'text-[#88929B] hover:text-white'
                }`}
              >
                Commands
              </button>
              <button
                onClick={() => setLogFilter('player')}
                className={`px-2 py-1 rounded transition-colors ${
                  logFilter === 'player' ? 'bg-[#222630] text-[#38BDF8] font-semibold' : 'text-[#88929B] hover:text-white'
                }`}
              >
                Players
              </button>
              <button
                onClick={() => setLogFilter('warn')}
                className={`px-2 py-1 rounded transition-colors ${
                  logFilter === 'warn' ? 'bg-[#222630] text-[#F59E0B] font-semibold' : 'text-[#88929B] hover:text-white'
                }`}
              >
                Warnings
              </button>
            </div>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              title={autoScroll ? 'Disable Auto-Scroll' : 'Enable Auto-Scroll'}
              className={`p-1.5 rounded border text-xs font-mono-code transition-colors ${
                autoScroll
                  ? 'bg-[#0EA5E9]/15 border-[#0EA5E9] text-[#0EA5E9]'
                  : 'bg-[#181A20] border-[#2E3440] text-[#88929B]'
              }`}
            >
              {autoScroll ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>

            {/* Clear Screen */}
            <button
              onClick={() => sendRconCommand('clear')}
              className="p-1.5 rounded bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] text-[#88929B] hover:text-white transition-colors"
              title="Clear terminal buffer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Stream Area (Dark Recess #0A0B0E) */}
        <div className="flex-1 bg-[#0A0B0E] p-4 overflow-y-auto font-mono-code text-[11px] leading-relaxed space-y-1 select-text">
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 hover:bg-white/[0.02] px-1 py-0.5 rounded">
              <span className="text-[#64748B] shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`font-semibold shrink-0 select-none ${getLogSeverityColor(log.severity)}`}>
                [{log.source}]
              </span>
              <span className={`break-all ${getLogSeverityColor(log.severity)}`}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Quick Command Suggestion Chips */}
        <div className="p-2.5 bg-[#111317] border-t border-[#2E3440] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono-code shrink-0">
          <span className="text-[#64748B] text-[10px] uppercase font-bold shrink-0">Quick Cmd:</span>
          {commonCommands.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleInjectCommand(c.cmd)}
              className="px-2 py-0.5 rounded bg-[#181A20] hover:bg-[#222630] border border-[#2E3440] hover:border-[#0EA5E9] text-[#94A3B8] hover:text-white whitespace-nowrap transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Interactive Command Input Box */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-[#181A20] border-t border-[#2E3440] flex items-center gap-2 shrink-0">
          <div className="text-[#0EA5E9] font-mono-code font-bold text-xs pl-1">
            &gt;
          </div>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter RCON command (e.g. SwitchMap UGC1849201 SND, Kick, RotateMap, ServerInfo)..."
            className="flex-1 bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] rounded h-9 px-3 text-xs font-mono-code text-white placeholder-[#64748B] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputCommand.trim()}
            className="h-9 px-4 bg-[#0EA5E9] hover:bg-[#38BDF8] disabled:opacity-40 disabled:hover:bg-[#0EA5E9] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors font-mono-code shadow-sm shadow-[#0EA5E9]/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Right / Lower: Live Active Player Roster */}
      <div className="w-full xl:w-[420px] bg-[#111317] flex flex-col h-full overflow-hidden shrink-0">
        {/* Roster Header */}
        <div className="p-3.5 border-b border-[#2E3440] bg-[#181A20] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0EA5E9]" />
            <div>
              <span className="text-xs font-bold uppercase font-mono-code text-white">
                Active Player Roster
              </span>
              <span className="text-[11px] font-mono-code text-[#88929B] block">
                {players.length} / {activeServer.maxPlayers} Connected
              </span>
            </div>
          </div>

          <div className="relative w-36">
            <input
              type="text"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
              placeholder="Filter roster..."
              className="w-full h-7 bg-[#0F1115] border border-[#2E3440] rounded text-[11px] font-mono-code text-white pl-6 pr-2 placeholder-[#64748B] focus:outline-none focus:border-[#0EA5E9]"
            />
            <Search className="w-3 h-3 text-[#64748B] absolute left-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Players List Table */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredPlayers.map((player) => {
            const isBlue = player.team === 'blue';
            return (
              <div
                key={player.id}
                className="bg-[#181A20] border border-[#2E3440] hover:border-[#383F4D] rounded p-2.5 space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isBlue ? 'bg-[#38BDF8]' : 'bg-[#EF4444]'
                      }`}
                      title={isBlue ? 'Blue Team (Defenders)' : 'Red Team (Attackers)'}
                    />
                    <span className="text-xs font-bold text-white truncate max-w-[140px]" title={player.name}>
                      {player.name}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#64748B]">
                      {player.ping}ms
                    </span>
                  </div>

                  <span className="text-[11px] font-mono-code text-[#22C55E] font-bold">
                    {player.score} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono-code text-[#88929B] pt-1 border-t border-[#2E3440]/60">
                  <div className="flex items-center gap-2">
                    <span>K/D: {player.kills}/{player.deaths}</span>
                    <span aria-hidden="true">·</span>
                    <span>{player.connectedDuration}</span>
                  </div>

                  {/* Player Quick Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setTargetPlayerForKick(player);
                        setIsKickBanModalOpen(true);
                      }}
                      className="px-2 py-0.5 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/30 text-[#EF4444] text-[10px] font-mono-code font-semibold rounded transition-colors"
                      title="Kick / Ban Player"
                    >
                      Moderate
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPlayers.length === 0 && (
            <div className="text-center p-6 text-xs text-[#88929B] font-mono-code">
              No connected players found matching query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
