<div align="center">

# ⚡ SMT Line Digital Twin

### Synchronized 3D Monitoring with Master-Follower Architecture

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

A dual-theme web application for visualizing and controlling a 15-station SMT production line through interactive 3D digital twins with real-time synchronization between Admin (Master) and User (Follower) views.

</div>

---

## 🚀 Features

- **15 SMT Stations** — Each with a custom `.glb` 3D model, unique specs, and color-coded identity
- **Master-Follower Architecture** — Admin broadcasts a station → all connected Users instantly transition to that station's 3D view
- **Dual Theme** — Dark mode (navy/charcoal with neon-blue accents) and Light mode (white studio with professional grey/blue)
- **Custom 3D Models** — Hand-made `.glb` models loaded via React Three Fiber with auto-scaling and shadow support
- **Line Overview** — Interactive 3D overview of the entire assembly line on the home page
- **Smooth Transitions** — Framer Motion animations for view switching, info cards, and UI elements
- **Real-Time Sync** — Socket.io powered broadcast/release control with live connection status
- **Release Control** — Admin can release broadcast, returning all followers to the line overview

---

## 🏭 The 15 Stations

| # | Station | Model | 3D File |
|---|---------|-------|---------|
| 1 | **PCBA Magazine Loader** | Automated board feeding | `pcb_magazine_unloader.glb` |
| 2 | **Link Conveyor 1** | Smooth PCB transfer | `smt_conveyor.glb` |
| 3 | **Screen Printer** | FUJI / GPX CII | `fuji_gpx-cii_solder_paste_printer.glb` |
| 4 | **Link Conveyor 2** | Synchronized transfer | `smt_conveyor.glb` |
| 5 | **Solder Paste Inspection** | KohYoung SPI | `ky8030-2_3d_solder_paste_inspection_machine.glb` |
| 6 | **Reject Conveyor 1** | Faulty board segregation | `smt_conveyor.glb` |
| 7 | **Surface Mounter** | FUJI AIMEX III | `fuji_aimex_iii_smd_mounter.glb` |
| 8 | **Inspection Conveyor** | Visual check station | `smt_conveyor.glb` |
| 9 | **Pre AOI** | Magic Ray | `aoi_kohyoung.glb` |
| 10 | **Reject Conveyor 2** | Mid-line reject | `smt_conveyor.glb` |
| 11 | **Reflow Oven** | Heller 1937 MK 7 | `heller_1936_mk7_wave_soldering_machine.glb` |
| 12 | **Cooling Conveyor** | Rapid board cooling | `cooling_conveyor.glb` |
| 13 | **Final AOI** | KohYoung Zenith Alpha | `aoi_kohyoung.glb` |
| 14 | **Reject Conveyor 3** | Final segregation | `smt_conveyor.glb` |
| 15 | **Magazine Unloader** | Automated stacking | `pcb_magazine_unloader.glb` |

**Line Overview:** `automated_pcb_assembly_line.glb`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite 6 |
| **3D Engine** | Three.js (r170) via React Three Fiber + Drei |
| **Animations** | Framer Motion |
| **State** | Zustand |
| **Real-Time** | Socket.io (Client + Server) |
| **Styling** | Tailwind CSS 3.4 (dual-theme) |
| **Routing** | React Router DOM v6 |
| **Backend** | Node.js + Express |
| **Fonts** | Orbitron · Inter · JetBrains Mono |

---

## 📂 Project Structure

```
smt-digital-twin/
├── index.html                  # Entry HTML (dark class for theme)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config with Socket.io proxy
├── tailwind.config.js          # Dual-theme color palettes
├── postcss.config.js           # PostCSS plugins
│
├── public/
│   └── models/                 # 9 custom .glb 3D models
│
├── server/
│   ├── index.js                # Express + Socket.io server
│   └── package.json            # Server dependencies
│
└── src/
    ├── main.jsx                # Entry with ThemeProvider
    ├── App.jsx                 # Router: Landing → Admin / User
    ├── index.css               # Dual-theme styles & glassmorphism
    │
    ├── context/
    │   └── ThemeContext.jsx     # Global Light/Dark theme context
    │
    ├── components/
    │   ├── HomeScene3D.jsx     # 3D line overview (GLB model)
    │   ├── MachineDetailScene.jsx  # Per-machine GLB 3D view
    │   ├── MachineInfoCard.jsx # Themed spec overlay card
    │   ├── AdminSidebar.jsx    # 15-machine list + broadcast
    │   └── ThemeToggle.jsx     # Sun/Moon toggle button
    │
    ├── views/
    │   ├── AdminView.jsx       # Sidebar + 3D + broadcast banner
    │   └── UserView.jsx        # Full-screen follower mode
    │
    ├── data/
    │   └── machines.js         # 15-station database with model paths
    │
    ├── store/
    │   └── useMachineStore.js  # Zustand store + socket listeners
    │
    └── socket/
        └── socket.js           # Socket.io client singleton
```

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/ananthu-pm/SMT_LINE.git
cd SMT_LINE

# Install frontend dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..
```

### Configuration

Create a `.env` file in the project root:

```env
VITE_SOCKET_URL=http://localhost:4000
```

### Running

```bash
# Start both frontend and backend concurrently
npm start

# Or individually:
npm run dev       # Frontend (Vite on port 5173)
npm run server    # Backend (Socket.io on port 4000)
```

---

## 🖥️ Usage

| Route | View | Description |
|-------|------|-------------|
| `/` | **Landing** | Role selection — Admin or User |
| `/admin` | **Admin** | Machine sidebar, broadcast controls, 3D preview, info card |
| `/user` | **User** | Full-screen follower with auto-synced transitions |

### Workflow

1. Open `/admin` on one tab/device → see the Line Overview
2. Open `/user` on another tab/device → see the same Line Overview
3. **Admin clicks a station** → User's view smoothly transitions to that station's 3D model + specs
4. **Admin clicks Release** → Both views return to the Line Overview
5. **Toggle theme** (☀️/🌙) → 3D canvas background and UI switch simultaneously

---

## 🎨 Design System

### Dark Mode
- **Background**: `#0c0c14` — Deep charcoal/navy
- **Accents**: Neon blue `#00b4ff` · Indigo `#6366f1`
- **Grid**: Neon-blue glow lines on dark floor

### Light Mode
- **Background**: `#f8f9fc` — High-key white studio
- **Accents**: Blue `#3b82f6` · Soft shadows
- **Grid**: Professional grey lines

### Shared
- **Typography**: Orbitron (headings) · Inter (body) · JetBrains Mono (data)
- **Animations**: Framer Motion transitions, pulse glow, slide-up

---

## 🔌 Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `SYNC_STATE` | Server → Client | `{ machineId }` | Current state on connect |
| `BROADCAST_START` | Client → Server | `{ machineId }` | Admin selects a station |
| `BROADCAST_START` | Server → All | `{ machineId }` | Rebroadcast to all clients |
| `RELEASE_CONTROL` | Client → Server | — | Admin releases broadcast |
| `RELEASE_CONTROL` | Server → All | — | Return everyone to overview |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ⚡ by [Ananthu P M](https://github.com/ananthu-pm)**

</div>
