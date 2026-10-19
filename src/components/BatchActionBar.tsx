import React from 'react';
import { useServer } from '../context/ServerContext';
import { Download, RefreshCw, Layers, Trash2, X, CheckSquare } from 'lucide-react';

export const BatchActionBar: React.FC = () => {
  const {
    selectedBatchIds,
    clearBatchSelect,
    batchInstall,
    batchUpdate,
    batchUninstall,
    batchAddToMapCycle,
  } = useServer();

  if (selectedBatchIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#181A20] border border-[#0EA5E9] rounded-lg px-4 py-2.5 shadow-2xl shadow-black/90 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
      {/* Selected Counter */}
      <div className="flex items-center gap-2 pr-3 border-r border-[#2E3440]">
        <CheckSquare className="w-4 h-4 text-[#0EA5E9]" />
        <span className="text-xs font-mono-code font-bold text-white whitespace-nowrap">
          {selectedBatchIds.length} Selected
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => batchInstall(selectedBatchIds)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap shadow-sm shadow-[#0EA5E9]/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>

        <button
          onClick={() => batchUpdate(selectedBatchIds)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-[#F59E0B] text-xs font-semibold rounded transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update</span>
        </button>

        <button
          onClick={() => batchAddToMapCycle(selectedBatchIds)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222630] hover:bg-[#2A303C] border border-[#2E3440] hover:border-[#383F4D] text-[#38BDF8] text-xs font-semibold rounded transition-colors whitespace-nowrap"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Add to Rotation</span>
        </button>

        <button
          onClick={() => batchUninstall(selectedBatchIds)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-medium rounded transition-colors whitespace-nowrap"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Uninstall</span>
        </button>
      </div>

      {/* Clear Button */}
      <div className="pl-2 border-l border-[#2E3440]">
        <button
          onClick={clearBatchSelect}
          className="p-1 rounded text-[#88929B] hover:text-white hover:bg-[#222630] transition-colors"
          title="Clear Selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
