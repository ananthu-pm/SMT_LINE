<div align="center">

# ⚡ SMT Line Digital Twin

### L&T Smart Manufacturing — Synchronized 3D Monitoring

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)

A web application for visualizing and controlling a 15-station SMT production line through interactive 3D digital twins with real-time synchronization between Admin (Master) and User (Follower) views, featuring a realistic factory shop floor environment.

</div>

---

## 🚀 Features

- **15 SMT Stations** — Each with a custom `.glb` 3D model, unique specs, and color-coded identity
- **Master-Follower Architecture** — Admin broadcasts a station → all connected Users instantly transition to that station's 3D view
- **Realistic Factory Environment** — Enclosed shop floor with walls, door opening, yellow safety markings, EXIT sign, and wall-mounted 3D TV screens
- **3D TV Monitors** — 5 GLB TV models mounted on factory walls displaying dashboards
- **Robot Assistant** — Animated AI assistant with per-machine audio narration
- **Custom 3D Models** — `.glb` models loaded via React Three Fiber with auto-scaling, white-color correction, and shadow support
- **Line Overview** — Interactive 3D overview of the entire assembly line on the home page
- **Smooth Transitions** — Framer Motion animations for view switching, info cards, and UI elements
- **Real-Time Sync** — Socket.io powered broadcast/release control with live connection status
- **L&T Branding** — Company logo on landing page and user view
- **Custom Machine Icons** — Each station has a unique icon replacing default emojis

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
| 9 | **Pre AOI** | KohYoung Zenith Alpha 3D AOI | `aoi_kohyoung.glb` |
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
| **Styling** | Tailwind CSS 3.4 |
| **Routing** | React Router DOM v6 |
| **Backend** | Node.js + Express |
| **Fonts** | Orbitron · Inter · JetBrains Mono |

---

## 📂 Project Structure

```
smt-digital-twin/
├── index.html                  # Entry HTML
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config with Socket.io proxy
├── tailwind.config.js          # Theme color palettes
├── postcss.config.js           # PostCSS plugins
│
├── public/
│   ├── models/                 # 9 custom .glb 3D machine models
│   ├── assets/
│   │   ├── tv/                 # 5 TV GLB models (wall-mounted)
│   │   ├── icons/              # Custom machine & UI icons
│   │   ├── audio/              # Per-machine audio narration files
│   │   ├── lt-logo.png         # L&T company logo
│   │   ├── robot.gif           # Animated robot assistant
│   │   └── robot-still.png     # Robot static image
│   └── lt-favicon.png          # App favicon
│
├── server/
│   ├── index.js                # Express + Socket.io server
│   └── package.json            # Server dependencies
│
└── src/
    ├── main.jsx                # Entry with ThemeProvider
    ├── App.jsx                 # Router: Landing → Admin / User
    ├── index.css               # Theme styles & glassmorphism
    │
    ├── 3d/
    │   └── environment/
    │       └── FactoryEnvironment.jsx  # Factory walls, floor, TVs, EXIT sign
    │
    ├── context/
    │   └── ThemeContext.jsx     # Light theme context
    │
    ├── components/
    │   ├── HomeScene3D.jsx      # 3D line overview (GLB model)
    │   ├── MachineDetailScene.jsx  # Per-machine GLB 3D view
    │   ├── MachineInfoCard.jsx  # Spec overlay card
    │   ├── AdminSidebar.jsx     # 15-machine list + broadcast
    │   ├── RobotAssistant.jsx   # AI robot with audio narration
    │   └── ErrorBoundary.jsx    # Error handling
    │
    ├── views/
    │   ├── AdminView.jsx        # Sidebar + 3D + broadcast banner
    │   └── UserView.jsx         # Full-screen follower mode
    │
    ├── data/
    │   └── machines.js          # 15-station database with model paths
    │
    ├── store/
    │   └── useMachineStore.js   # Zustand store + socket listeners
    │
    └── socket/
        └── socket.js            # Socket.io client singleton
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
| `/user` | **User** | Full-screen follower with auto-synced transitions + robot assistant |

### Workflow

1. Open `/admin` on one tab/device → see the Line Overview
2. Open `/user` on another tab/device → see the same Line Overview
3. **Admin clicks a station** → User's view smoothly transitions to that station's 3D model + specs
4. **Admin clicks Release** → Both views return to the Line Overview

---

## 🏗️ Factory Environment

The 3D scene features a realistic enclosed SMT shop floor:

- **White industrial floor** — Clean, no grid
- **4 walls** — Back, Left, Right, Front (with door opening)
- **Yellow safety markings** — Rectangular work zone boundary
- **5 wall-mounted 3D TVs** — Dashboard monitors on back, left, and right walls
- **"EXIT" sign** — Red sign with white text above the front door
- **"L&T SMT SHOP FLOOR - ZONE B"** — Wall signage text
- **Professional lighting** — Ambient, directional, hemisphere, and fill lights

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
