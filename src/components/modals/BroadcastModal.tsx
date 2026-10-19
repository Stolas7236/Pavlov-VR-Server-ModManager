import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import { X, Megaphone, Send } from 'lucide-react';

export const BroadcastModal: React.FC = () => {
  const { isBroadcastModalOpen, setIsBroadcastModalOpen, broadcastMessage } = useServer();

  const [message, setMessage] = useState('');
  const [preset, setPreset] = useState('');

  if (!isBroadcastModalOpen) return null;

  const quickPresets = [
    'Match beginning in 60 seconds - Ready up!',
    'Server restarting after this round for mod updates.',
    'Please maintain team voice communications only.',
    'Tournament rules in effect: Friendly fire is active.',
    'Map vote starting at the end of this round.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    broadcastMessage(message.trim());
    setMessage('');
    setIsBroadcastModalOpen(false);
  };

  const handleSelectPreset = (text: string) => {
    setMessage(text);
    setPreset(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181A20] border border-[#383F4D] rounded-lg max-w-md w-full shadow-2xl shadow-black overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#111317] border-b border-[#2E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#F59E0B]/15 text-[#F59E0B]">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                Server Broadcast Announcement
              </h3>
              <p className="text-[11px] text-[#88929B]">
                Transmit head-up display notification to all in-game VR headsets
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBroadcastModalOpen(false)}
            className="text-[#88929B] hover:text-white p-1 rounded hover:bg-[#222630] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Quick presets */}
          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1.5">
              Quick Operational Presets
            </label>
            <div className="space-y-1">
              {quickPresets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`w-full text-left text-xs p-2 rounded border transition-colors truncate ${
                    preset === p
                      ? 'bg-[#0EA5E9]/15 border-[#0EA5E9] text-white'
                      : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-[#E2E2E8] hover:border-[#383F4D]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Custom Message Payload
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type broadcast text visible on VR HUD..."
              className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2.5 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* In-Game Preview */}
          {message.trim() && (
            <div className="bg-[#0A0B0E] border border-[#383F4D] rounded p-2.5">
              <span className="text-[10px] uppercase font-mono-code text-[#88929B] block mb-1">
                VR Player HUD Preview:
              </span>
              <div className="bg-[#111317] border border-[#0EA5E9]/50 rounded p-2 text-center text-xs font-mono-code text-[#38BDF8] font-bold">
                [BROADCAST]: {message}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2E3440]">
            <button
              type="button"
              onClick={() => setIsBroadcastModalOpen(false)}
              className="px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] text-xs text-[#E2E2E8] font-medium rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit to Server</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
