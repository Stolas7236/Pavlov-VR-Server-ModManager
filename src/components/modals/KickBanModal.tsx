import React, { useState, useEffect } from 'react';
import { useServer } from '../../context/ServerContext';
import { X, UserX, ShieldAlert, AlertTriangle } from 'lucide-react';

export const KickBanModal: React.FC = () => {
  const {
    isKickBanModalOpen,
    setIsKickBanModalOpen,
    players,
    targetPlayerForKick,
    setTargetPlayerForKick,
    kickPlayer,
  } = useServer();

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [actionType, setActionType] = useState<'kick' | 'ban'>('kick');
  const [banDuration, setBanDuration] = useState<number>(24);
  const [reason, setReason] = useState<string>('Griefing / Unsportsmanlike conduct');

  useEffect(() => {
    if (targetPlayerForKick) {
      setSelectedPlayerId(targetPlayerForKick.id);
    } else if (players.length > 0 && !selectedPlayerId) {
      setSelectedPlayerId(players[0].id);
    }
  }, [targetPlayerForKick, players, selectedPlayerId]);

  if (!isKickBanModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId) return;

    kickPlayer(selectedPlayerId, reason, actionType === 'ban', banDuration);
    setTargetPlayerForKick(null);
    setIsKickBanModalOpen(false);
  };

  const activeTarget = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181A20] border border-[#EF4444]/40 rounded-lg max-w-md w-full shadow-2xl shadow-black overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#111317] border-b border-[#2E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#EF4444]/15 text-[#EF4444]">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                Player Moderation & Enforcement
              </h3>
              <p className="text-[11px] text-[#88929B]">
                Issue instant RCON Kick or Ban directive
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setTargetPlayerForKick(null);
              setIsKickBanModalOpen(false);
            }}
            className="text-[#88929B] hover:text-white p-1 rounded hover:bg-[#222630] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Target Player */}
          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Target Player
            </label>
            <select
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#EF4444] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
            >
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · Ping: {p.ping}ms · {p.team.toUpperCase()} · K/D: {p.kills}/{p.deaths}
                </option>
              ))}
            </select>

            {activeTarget && (
              <div className="mt-1.5 text-[11px] font-mono-code text-[#88929B] flex items-center justify-between bg-[#0F1115] px-2 py-1 rounded border border-[#2E3440]">
                <span>SteamID64: {activeTarget.steamId}</span>
                <span>Session: {activeTarget.connectedDuration}</span>
              </div>
            )}
          </div>

          {/* Action Type: Kick or Ban */}
          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Disciplinary Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('kick')}
                className={`py-2 px-3 rounded text-xs font-semibold border transition-colors ${
                  actionType === 'kick'
                    ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                    : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-white'
                }`}
              >
                Immediate Kick
              </button>
              <button
                type="button"
                onClick={() => setActionType('ban')}
                className={`py-2 px-3 rounded text-xs font-semibold border transition-colors ${
                  actionType === 'ban'
                    ? 'bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]'
                    : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-white'
                }`}
              >
                RCON Ban
              </button>
            </div>
          </div>

          {/* Ban Duration if Ban */}
          {actionType === 'ban' && (
            <div>
              <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                Ban Duration
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(Number(e.target.value))}
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#EF4444] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
              >
                <option value={1}>1 Hour (Temporary Cool-off)</option>
                <option value={24}>24 Hours (Standard Infraction)</option>
                <option value={168}>7 Days (Severe Griefing)</option>
                <option value={8760}>Permanent Ban (Exploits / Cheating)</option>
              </select>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Reason / Violation Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#EF4444] rounded p-2 text-xs text-white focus:outline-none mb-1.5"
            >
              <option value="Teamkilling & Intentional Friendly Fire">Teamkilling & Intentional Friendly Fire</option>
              <option value="Griefing / VR Harassment">Griefing / VR Harassment</option>
              <option value="Hate Speech & Toxic Voice Chat">Hate Speech & Toxic Voice Chat</option>
              <option value="Map Geometry Glitching & Exploit Abuse">Map Geometry Glitching & Exploit Abuse</option>
              <option value="AFK / Non-responsive in S&D">AFK / Non-responsive in S&D</option>
            </select>
          </div>

          <div className="flex items-start gap-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded p-2.5 text-xs text-[#ffb4ab]">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            <span>
              This will execute a live RCON network packet directly disconnecting the client session.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2E3440]">
            <button
              type="button"
              onClick={() => {
                setTargetPlayerForKick(null);
                setIsKickBanModalOpen(false);
              }}
              className="px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] text-xs text-[#E2E2E8] font-medium rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#EF4444]/30"
            >
              Confirm {actionType === 'ban' ? 'Ban' : 'Kick'} Directive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
