/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ServerProvider, useServer } from './context/ServerContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ModCatalogView } from './components/views/ModCatalogView';
import { RconTerminalView } from './components/views/RconTerminalView';
import { MapCycleView } from './components/views/MapCycleView';
import { ServerConfigView } from './components/views/ServerConfigView';
import { ModInspectorDrawer } from './components/ModInspectorDrawer';
import { BatchActionBar } from './components/BatchActionBar';
import { AddModModal } from './components/modals/AddModModal';
import { KickBanModal } from './components/modals/KickBanModal';
import { BroadcastModal } from './components/modals/BroadcastModal';
import { CombatVideoModal } from './components/modals/CombatVideoModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab, selectedModId, setSelectedModId } = useServer();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0F1115] text-[#E2E2E8] overflow-hidden font-sans select-none">
      {/* Top Bar Contract (Wordmark - Nav Links - Primary Action) */}
      <Navbar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Rail: Server Profile Switcher, Telemetry, and RCON Directives */}
        <Sidebar />

        {/* Center Main Viewport */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {activeTab === 'mods' && <ModCatalogView />}
          {activeTab === 'rcon' && <RconTerminalView />}
          {activeTab === 'mapcycle' && <MapCycleView />}
          {activeTab === 'config' && <ServerConfigView />}

          {/* Floating Batch Action Toolbar */}
          <BatchActionBar />
        </main>

        {/* Right Collapsible Inspector Drawer */}
        {selectedModId && (
          <ModInspectorDrawer onClose={() => setSelectedModId(null)} />
        )}
      </div>

      {/* Interactive Operational Modals */}
      <AddModModal />
      <KickBanModal />
      <BroadcastModal />
      <CombatVideoModal />

      {/* Tactical Feedback Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ServerProvider>
      <MainLayout />
    </ServerProvider>
  );
}
