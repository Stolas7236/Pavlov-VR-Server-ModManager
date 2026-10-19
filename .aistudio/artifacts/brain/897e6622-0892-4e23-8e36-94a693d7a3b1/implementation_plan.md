# Pavlov Tactical Command: Server & Workshop Manager

A high-density, tactical dark command center for Pavlov VR dedicated server operators and community managers. Built with high-tech precision aesthetics, it delivers instant situational awareness, Steam Workshop UGC mod asset deployment, live RCON terminal command execution, and map cycle configuration—completely client-authoritative with persistent local storage and GitHub Pages static deployment compatibility.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions reflect user selections from the initial consultation and tactical design requirements:

- **Primary Default Screen**: **Steam Workshop Mods & Map Asset Manager** (`모드 및 맵 관리자`) opens as the initial view with responsive grid layout and collapsible inspector drawer.
- **Pre-Loaded Tactical Catalog**: Comprehensive collection populated with competitive Search & Destroy (S&D), WWII Push assault maps, modern custom weapon packs, and zombie co-op scenarios.
- **Active Tactical Utilities**:
  1. **Live RCON Quick Actions**: Instant Map Switch, Player Kick/Ban modal, Server Broadcast announcement, and match restart controls.
  2. **Batch Mod Sync & Download Simulation**: Multi-select mod management, staged downloads with realistic progress bars, and version sync verification.
  3. **Export Engine**: One-click generation and clipboard export of valid Pavlov `Game.ini` and `MapCycle.csv` configs.
- **Runtime & Deployment**: 100% Client-side React 19 + TypeScript + Tailwind CSS with persistent browser storage (`localStorage`), zero backend dependency, and full GitHub Pages compatibility.

---

## 1. Overview & Core Concept

- **What It Does**: Provides Pavlov VR server administrators with a desktop-grade command dashboard to discover, inspect, batch-install, and organize Workshop UGC mods, trigger real-time RCON console directives, and visually order map rotation cycles.
- **Target Audience / Persona**: VR community hosters, league tournament administrators, and dedicated server operators who need rapid asset deployment and zero-friction server control during live sessions.
- **Key Value**: Replaces cumbersome manual FTP/SSH and raw text editing with a visual, high-contrast operational console that enforces accurate UGC IDs, automatic dependency checks, and one-click RCON command generation.

---

## 2. User Experience & Visual Design

### Design System: Tactical Dark Precision
Conforms strictly to the high-contrast tactical dark specifications:
- **Canvas & Elevation**:
  - `Tier 0 (App Canvas)`: `#0F1115` recessed base.
  - `Tier 1 (Surface Panels & Cards)`: `#181A20` with 1px border `#2E3440`.
  - `Tier 2 (Modals & Elevated Controls)`: `#222630` with border `#383F4D` and focused cyan halo (`#0EA5E9`).
- **Color Discipline (60-30-10)**:
  - 60% neutral obsidian charcoal canvas (`#0F1115` / `#181A20`).
  - 30% structural outlines (`#2E3440`), tabular panels, and muted slate typography (`#94A3B8`).
  - 10% high-signal accents: Electric Cyan (`#0EA5E9` / `#38BDF8`) for primary installations/active tabs, Telemetry Emerald (`#10B981` / `#22C55E`) for live RCON status, and Tactical Crimson (`#EF4444`) for destructive server halts or uninstallations.
- **Typography**:
  - Primary UI & Headers: Modern Sans (`Plus Jakarta Sans` / clean geometric sans) with tight tracking and balanced title wraps.
  - Telemetry, UGC IDs, Ports & Terminal: Strict tabular monospace (`JetBrains Mono`, `tabular-nums`).
- **Zero-Pill & Metadata Discipline**: Unboxed metadata tags separated by quiet middle dots (`·`) or slashes; interactive segmented filters are explicit functional buttons.

### Key Layout & User Flows
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: [ Pavlov Tactical Command ] ── [ Mods | RCON Terminal | Map Cycle | Server ] ── [ Sync All (3) ] │
├───────────────┬────────────────────────────────────────────────────────┬───────────────┤
│ LEFT RAIL     │ MAIN WORKSPACE VIEWPORT                                │ RIGHT DRAWER  │
│ (260px)       │                                                        │ (340px)       │
│               │ Search bar & Mode Filters: [All] [S&D] [Push] [Weapons]│               │
│ • Active Srv  │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │ Selected Mod: │
│   Pavlov-EU01 │ │ Sandstorm    │ │ Stalingrad   │ │ Modern GunPk │     │ UGC: 2849182  │
│   RCON: LIVE  │ │ UGC: 1849201 │ │ UGC: 2940194 │ │ UGC: 3019284 │     │ Size: 1.2 GB  │
│ • Server List │ │ S&D · 840 MB │ │ Push · 2.1GB │ │ Wep · 420 MB │     │ Dependencies  │
│ • Quick Stats │ │ [Installed]  │ │ [Update Avl] │ │ [Install]    │     │ [Launch Map]  │
│   16/24 Plrs  │ └──────────────┘ └──────────────┘ └──────────────┘     │ [Game.ini Cpy]│
│ • RCON Toggle │ Batch Actions Bar: 3 selected -> [Download] [Uninstall]│ [Uninstall]   │
└───────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

1. **Workshop Mod Explorer**:
   - Filter by categories: All, Search & Destroy, Push WWII, Custom Weapons, Deathmatch, Zombie Co-op.
   - Mod Card displays 16:9 thumbnail preview, title, author, file size, clean text tags, installed/update status, and quick-action hover buttons.
   - Batch Selection Mode: multi-select checkboxes to batch download, update, or add directly to the active map rotation.
2. **Right Inspector Drawer**:
   - Slides smoothly when a mod is clicked. Shows full description, workshop tags, UGC numeric ID with 1-click copy, dependencies, Game.ini rotation line (`MapRotation=(MapId="UGC1849201", GameMode="SND")`), and RCON "Set as Next Map" button.
3. **Live RCON Terminal & Server Command Center**:
   - Virtualized console window with colored log severity: `[INFO]`, `[RCON]`, `[WARN]`, `[CRIT]`.
   - Command input with history (Up/Down arrow navigation) and quick-action action triggers:
     - Change Map (triggers instant RCON `SwitchMap` packet)
     - Kick / Ban Player modal with reason and duration
     - Global Announcement broadcast popup
     - Reset S&D Round / Restart Server
4. **Map Cycle & Game.ini Visual Manager**:
   - Drag-and-drop or reorder buttons for the active server playlist.
   - Configure per-map game modes (`SND`, `TDM`, `GUN`, `PUSH`, `ZOMBIE`).
   - One-click copy/download of generated `Game.ini` and `MapCycle.csv`.

---

## 3. Key Product Decisions & Trade-Offs

- **Client-Authoritative State with LocalStorage**:
  - *Chosen Approach*: Store installed mods, custom map cycles, RCON command history, and server profiles in `localStorage` with reactive defaults.
  - *Why*: Enables instant zero-latency responses, works seamlessly on GitHub Pages static hosting, and allows users to modify their personal server configurations without requiring external database accounts.
- **RCON Protocol Simulation Engine**:
  - *Chosen Approach*: High-fidelity simulated RCON client with real Pavlov protocol command syntax (`SwitchMap <UGC>`, `Kick <PlayerId> <Reason>`, `ServerInfo`, `RotateMap`, `GiveTeamPoints <Team> <Score>`).
  - *Why*: Provides genuine administrative workflows, interactive console logs, and immediate feedback without needing an exposed open UDP/TCP RCON port on the public web.
- **Resilient Curated Mod Imagery**:
  - *Chosen Approach*: High-fidelity game-themed tactical screenshots and authentic UGC illustrations with styled CSS fallback containers to enforce the Zero-Broken-Image Policy.

---

## 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             React 19 App                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ LocalStorage State Engine                                                │
│ ├─ activeServerProfile (Name, IP, Port, RCON Status, PlayerCount)        │
│ ├─ installedMods (Catalog of 12+ preloaded mods + user added UGCs)       │
│ ├─ mapCycleList (Ordered playlist of MapId + GameMode)                   │
│ └─ rconLogFeed (Real-time timestamped event stream + interactive input)  │
├──────────────────────────────────────────────────────────────────────────┤
│ Components:                                                              │
│ ├─ AppLayout (Header, Left Rail, Responsive Viewport, Inspector Drawer)  │
│ ├─ ModCatalogView (Search, Category Filter, Grid, Batch Action Toolbar)  │
│ ├─ ModCard (16:9 Thumbnail, UGC ID, Status Indicator, Actions)          │
│ ├─ ModInspector (Deep details, Game.ini snippet, Direct RCON send)       │
│ ├─ RconTerminalView (Interactive CLI, Log stream, Quick action modals)   │
│ ├─ MapCycleView (Reorderable map list, GameMode switches, Exporter)      │
│ └─ AddModModal (Custom UGC ID and Title registration dialog)             │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Interactive Handlers**:
  - `handleInstallMod(id)` / `handleBatchSync(ids)`: Simulates timed download progress bar and shifts mod state to `installed` / `up-to-date`.
  - `handleSendRconCommand(cmd)`: Parses command, pushes formatted event to console feed, and executes simulated server state changes.
  - `handleExportConfig(format)`: Generates clean, properly formatted Pavlov `Game.ini` section `[/Script/Pavlov.DedicatedServer]` and downloads or copies to clipboard.
