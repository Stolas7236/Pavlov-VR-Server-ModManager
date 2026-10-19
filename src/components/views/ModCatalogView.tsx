import React, { useState, useMemo } from 'react';
import { useServer } from '../../context/ServerContext';
import { ModCard } from '../ModCard';
import { ModCategory, ModStatus } from '../../types';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  CheckCheck,
  PackageOpen,
} from 'lucide-react';

export const ModCatalogView: React.FC = () => {
  const {
    mods,
    setSelectedModId,
    selectedBatchIds,
    toggleBatchSelect,
    clearBatchSelect,
    selectAllMods,
    setIsAddModModalOpen,
  } = useServer();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<ModStatus>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'rating' | 'title' | 'size' | 'updated'>('downloads');

  const categories: { id: ModCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All mod.io Assets', count: mods.length },
    { id: 'snd', label: 'Search & Destroy', count: mods.filter((m) => m.category === 'snd').length },
    { id: 'push', label: 'WWII Push', count: mods.filter((m) => m.category === 'push').length },
    { id: 'weapons', label: 'Weapons & Gear', count: mods.filter((m) => m.category === 'weapons').length },
    { id: 'tdm', label: 'Deathmatch', count: mods.filter((m) => m.category === 'tdm').length },
    { id: 'zombies', label: 'Zombie Co-op', count: mods.filter((m) => m.category === 'zombies').length },
  ];

  const filteredMods = useMemo(() => {
    return mods
      .filter((mod) => {
        // Category filter
        if (selectedCategory !== 'all' && mod.category !== selectedCategory) {
          return false;
        }
        // Status filter
        if (selectedStatus !== 'all' && mod.status !== selectedStatus) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = mod.title.toLowerCase().includes(q);
          const matchUgc = mod.ugcId.includes(q);
          const matchAuthor = mod.author.toLowerCase().includes(q);
          const matchTag = mod.tags.some((t) => t.toLowerCase().includes(q));
          const matchMode = mod.gameMode.toLowerCase().includes(q);
          return matchTitle || matchUgc || matchAuthor || matchTag || matchMode;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'rating') return b.ratingPercentage - a.ratingPercentage;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'size') return b.fileSizeBytes - a.fileSizeBytes;
        if (sortBy === 'updated') return b.lastUpdated.localeCompare(a.lastUpdated);
        return 0;
      });
  }, [mods, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const allFilteredIds = filteredMods.map((m) => m.id);
  const isAllSelected =
    allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedBatchIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      clearBatchSelect();
    } else {
      selectAllMods(allFilteredIds);
    }
  };

  const installedCount = mods.filter((m) => m.status === 'installed').length;
  const updatesCount = mods.filter((m) => m.status === 'update_available').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0F1115]">
      {/* Control Bar: Search, Category Filters, Sort */}
      <div className="p-5 border-b border-[#2E3440] bg-[#111317] space-y-4 shrink-0">
        {/* Top line: Search and Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mod.io packages, UGC IDs, creators, or modes..."
              className="w-full h-9 bg-[#0F1115] border border-[#2E3440] focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] rounded text-xs text-[#E2E2E8] pl-9 pr-8 placeholder-[#64748B] transition-all focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Filters & Metrics */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Status Selector */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ModStatus)}
                className="h-9 bg-[#181A20] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs rounded px-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="all">All Statuses ({mods.length})</option>
                <option value="installed">Mounted ({installedCount})</option>
                <option value="update_available">Update Avail ({updatesCount})</option>
                <option value="not_installed">mod.io Hub</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-[#88929B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-9 bg-[#181A20] border border-[#2E3440] hover:border-[#383F4D] text-[#E2E2E8] text-xs rounded px-3 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="downloads">Downloads (Popular)</option>
                <option value="rating">Rating (% Positive)</option>
                <option value="title">Title (A - Z)</option>
                <option value="size">File Size (Descending)</option>
                <option value="updated">Recent Updates</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#88929B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Select All Toggle */}
            <button
              onClick={handleToggleSelectAll}
              className={`h-9 px-3 border rounded text-xs font-mono-code flex items-center gap-1.5 transition-colors ${
                isAllSelected
                  ? 'bg-[#0EA5E9]/15 border-[#0EA5E9] text-[#0EA5E9]'
                  : 'bg-[#181A20] border-[#2E3440] hover:border-[#383F4D] text-[#88929B] hover:text-white'
              }`}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
            </button>
          </div>
        </div>

        {/* Category Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white shadow-sm shadow-[#0EA5E9]/20 font-semibold'
                    : 'bg-[#181A20] border-[#2E3440] hover:border-[#383F4D] text-[#88929B] hover:text-[#E2E2E8]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 opacity-70 font-mono-code text-[11px]">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5">
        {filteredMods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {filteredMods.map((mod) => (
              <ModCard
                key={mod.id}
                mod={mod}
                isSelected={selectedBatchIds.includes(mod.id)}
                onSelect={() => toggleBatchSelect(mod.id)}
                onInspect={() => setSelectedModId(mod.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 bg-[#181A20] border border-[#2E3440] rounded-lg max-w-lg mx-auto mt-12">
            <PackageOpen className="w-12 h-12 text-[#88929B] mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-white mb-1">No Matching mod.io Packages Found</h3>
            <p className="text-xs text-[#88929B] mb-4">
              Try relaxing your category or status filters, or register a custom mod.io UGC ID.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}
                className="px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] text-xs text-white rounded transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsAddModModalOpen(true)}
                className="px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-xs font-semibold text-white rounded transition-colors"
              >
                + Register mod.io UGC ID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
