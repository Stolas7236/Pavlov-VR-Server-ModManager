import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import {
  Sliders,
  Save,
  Shield,
  Clock,
  Volume2,
  Activity,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const ServerConfigView: React.FC = () => {
  const { config, updateConfig, showToast } = useServer();

  const [form, setForm] = useState(config);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof typeof config, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(form);
    setHasChanges(false);
    showToast('Saved Pavlov Game.ini parameters', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0F1115] p-6">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E3440]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#181A20] border border-[#2E3440] text-[#0EA5E9]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase font-mono-code text-white">
                Pavlov Game.ini Rule Configuration
              </h2>
              <p className="text-xs text-[#88929B]">
                Tune engine tickrates, round timers, voice chat, and competitive balance rules
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#38BDF8] disabled:opacity-40 text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
          >
            <Save className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Network */}
          <div className="bg-[#181A20] border border-[#2E3440] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono-code text-[#0EA5E9] flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Server Identity & Access Control
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Public Server Name
                </label>
                <input
                  type="text"
                  value={form.serverName}
                  onChange={(e) => handleChange('serverName', e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Max Player Capacity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={4}
                    max={32}
                    step={2}
                    value={form.maxPlayers}
                    onChange={(e) => handleChange('maxPlayers', Number(e.target.value))}
                    className="flex-1 accent-[#0EA5E9]"
                  />
                  <span className="text-xs font-mono-code font-bold text-white w-10 text-right">
                    {form.maxPlayers}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E2E2E8]">
                <input
                  type="checkbox"
                  checked={form.passwordProtection}
                  onChange={(e) => handleChange('passwordProtection', e.target.checked)}
                  className="w-4 h-4 rounded-[2px] bg-[#0F1115] border-[#2E3440] accent-[#0EA5E9]"
                />
                <span>Password Protected Server</span>
              </label>

              {form.passwordProtection && (
                <input
                  type="text"
                  placeholder="Enter lobby password..."
                  value={form.serverPassword || ''}
                  onChange={(e) => handleChange('serverPassword', e.target.value)}
                  className="bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-1.5 text-xs text-white focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Gameplay Timers */}
          <div className="bg-[#181A20] border border-[#2E3440] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono-code text-[#38BDF8] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Round Timers & Defusal Physics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Round Time (Seconds)
                </label>
                <input
                  type="number"
                  min={60}
                  max={600}
                  step={10}
                  value={form.roundTimeSeconds}
                  onChange={(e) => handleChange('roundTimeSeconds', Number(e.target.value))}
                  className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
                />
                <span className="text-[10px] text-[#64748B] font-mono-code mt-0.5 block">
                  {Math.floor(form.roundTimeSeconds / 60)}m {form.roundTimeSeconds % 60}s
                </span>
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Warmup Duration (Seconds)
                </label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  step={5}
                  value={form.warmupTimeSeconds}
                  onChange={(e) => handleChange('warmupTimeSeconds', Number(e.target.value))}
                  className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Bomb Defusal Timer (Seconds)
                </label>
                <input
                  type="number"
                  min={25}
                  max={60}
                  step={5}
                  value={form.bombTimeSeconds}
                  onChange={(e) => handleChange('bombTimeSeconds', Number(e.target.value))}
                  className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Engine & Tactical Rules */}
          <div className="bg-[#181A20] border border-[#2E3440] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase font-mono-code text-[#22C55E] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Tactical & Engine Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Server Tickrate Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[60, 90, 120].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleChange('tickRatePreset', rate)}
                      className={`py-2 rounded text-xs font-mono-code font-bold border transition-colors ${
                        form.tickRatePreset === rate
                          ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-[#0EA5E9]'
                          : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-white'
                      }`}
                    >
                      {rate} Hz
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                  Voice Chat Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('voiceChat', 'team')}
                    className={`py-2 rounded text-xs font-mono-code font-medium border transition-colors ${
                      form.voiceChat === 'team'
                        ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-white'
                        : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-white'
                    }`}
                  >
                    Team Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('voiceChat', 'all')}
                    className={`py-2 rounded text-xs font-mono-code font-medium border transition-colors ${
                      form.voiceChat === 'all'
                        ? 'bg-[#0EA5E9]/20 border-[#0EA5E9] text-white'
                        : 'bg-[#0F1115] border-[#2E3440] text-[#88929B] hover:text-white'
                    }`}
                  >
                    All Talk
                  </button>
                </div>
              </div>
            </div>

            {/* Tactical Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded bg-[#0F1115] border border-[#2E3440] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.friendlyFire}
                  onChange={(e) => handleChange('friendlyFire', e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0EA5E9]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Friendly Fire</span>
                  <span className="text-[10px] text-[#88929B]">Damage team members on hit</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded bg-[#0F1115] border border-[#2E3440] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autoBalance}
                  onChange={(e) => handleChange('autoBalance', e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0EA5E9]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Auto Team Balance</span>
                  <span className="text-[10px] text-[#88929B]">Even team sizes between rounds</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded bg-[#0F1115] border border-[#2E3440] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.competitiveRules}
                  onChange={(e) => handleChange('competitiveRules', e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0EA5E9]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Competitive League Rules</span>
                  <span className="text-[10px] text-[#88929B]">Strict tournament economy and defusal</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded bg-[#0F1115] border border-[#2E3440] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.customWeaponsEnabled}
                  onChange={(e) => handleChange('customWeaponsEnabled', e.target.checked)}
                  className="w-4 h-4 rounded-[2px] accent-[#0EA5E9]"
                />
                <div>
                  <span className="text-xs font-medium text-white block">Allow Custom UGC Weapons</span>
                  <span className="text-[10px] text-[#88929B]">Mount workshop armory attachments</span>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
