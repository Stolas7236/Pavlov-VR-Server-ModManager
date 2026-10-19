import React, { useState } from 'react';
import { useServer } from '../../context/ServerContext';
import { X, Plus, Hash } from 'lucide-react';
import { ModCategory } from '../../types';

export const AddModModal: React.FC = () => {
  const { isAddModModalOpen, setIsAddModModalOpen, addNewMod } = useServer();

  const [ugcId, setUgcId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ModCategory>('snd');
  const [author, setAuthor] = useState('');
  const [fileSize, setFileSize] = useState('650 MB');
  const [gameMode, setGameMode] = useState('SND');
  const [description, setDescription] = useState('');

  if (!isAddModModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ugcId.trim() && !title.trim()) return;

    const cleanUgc = ugcId.replace(/\D/g, '') || `${Date.now()}`.slice(-7);
    const slug = (title || `mod-${cleanUgc}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    addNewMod({
      ugcId: cleanUgc,
      modioSlug: slug,
      modioUrl: `https://mod.io/g/pavlov/m/${slug}`,
      title: title.trim() || `mod.io UGC ${cleanUgc}`,
      category: category === 'all' ? 'snd' : category,
      gameMode: gameMode.toUpperCase(),
      author: author.trim() || 'mod.io Creator',
      fileSizeFormatted: fileSize || '500 MB',
      description: description.trim() || 'Custom Pavlov VR mod.io package registered via Tactical Command Operator console.',
      isCustomMap: category !== 'weapons',
    });

    // Reset and close
    setUgcId('');
    setTitle('');
    setDescription('');
    setIsAddModModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#181A20] border border-[#383F4D] rounded-lg max-w-md w-full shadow-2xl shadow-black overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#111317] border-b border-[#2E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-[#222630] text-[#0EA5E9]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
                Register mod.io Package
              </h3>
              <p className="text-[11px] text-[#88929B]">
                Mount custom mod.io UGC maps and weapon assets to server
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModModalOpen(false)}
            className="text-[#88929B] hover:text-white p-1 rounded hover:bg-[#222630] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              mod.io Item UGC ID *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={ugcId}
                onChange={(e) => setUgcId(e.target.value)}
                placeholder="e.g. 1849201 or https://mod.io/g/pavlov/m/..."
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white pl-8 focus:outline-none"
              />
              <Hash className="w-3.5 h-3.5 text-[#88929B] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Package Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Subzero Infiltration S&D"
              className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const val = e.target.value as ModCategory;
                  setCategory(val);
                  if (val === 'snd') setGameMode('SND');
                  else if (val === 'push') setGameMode('PUSH');
                  else if (val === 'weapons') setGameMode('GLOBAL');
                  else if (val === 'zombies') setGameMode('ZOMBIE');
                  else if (val === 'tdm') setGameMode('TDM');
                }}
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs text-white focus:outline-none"
              >
                <option value="snd">Search & Destroy (S&D)</option>
                <option value="push">WWII Push Assault</option>
                <option value="weapons">Custom Weapons Pack</option>
                <option value="tdm">Team Deathmatch (TDM)</option>
                <option value="zombies">Zombie Co-op Survival</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                GameMode Code
              </label>
              <input
                type="text"
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value.toUpperCase())}
                placeholder="SND, PUSH, TDM..."
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white focus:outline-none uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                Creator / Studio
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="mod.io Author"
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
                Estimated Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="650 MB"
                className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs font-mono-code text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono-code text-[#88929B] block mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational notes, layout synopsis..."
              className="w-full bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] rounded p-2 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#2E3440]">
            <button
              type="button"
              onClick={() => setIsAddModModalOpen(false)}
              className="px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] text-xs text-[#E2E2E8] font-medium rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors shadow-sm shadow-[#0EA5E9]/20"
            >
              Mount mod.io Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
