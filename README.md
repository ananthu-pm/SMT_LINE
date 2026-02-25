<div align="center">

# ⚡ SMT Digital Twin

### Real-time 3D Monitoring & Synchronized Control for SMT Production Lines

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r170-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

A cyberpunk-themed web application for visualizing and controlling an SMT (Surface Mount Technology) production line through interactive 3D digital twins with real-time synchronization between Admin and User views.

</div>

---

## 🚀 Features

- **Interactive 3D Viewport** — Procedural Three.js models for 5 SMT machines with orbit controls, animations, and status-driven glow effects
- **Admin Dashboard** — Select and broadcast any machine to all connected users in real-time
- **User Follower Mode** — Automatically syncs to the admin-selected machine with live connection status
- **OEE Dashboard** — SVG gauge rings displaying Availability, Performance, and Quality metrics per machine
- **Machine-Specific Data Panels** — Detailed overlays showing parameters like zone temperatures, feeder status, defect breakdowns, and height maps
- **Real-Time Sync** — Socket.io powered bidirectional communication for instant machine selection and status updates
- **Cyberpunk UI** — Dark industrial theme with neon glows, glassmorphism, scan-line effects, and custom scrollbars

---

## 🏭 Machines Modeled

| # | Machine | Model Reference | Status |
|---|---------|----------------|--------|
| 1 | **Solder Paste Printer** | DEK Horizon iX | 🟢 Running |
| 2 | **SPI (Solder Paste Inspection)** | Koh Young Zenith 3D | 🟢 Running |
| 3 | **Pick & Place (High Speed)** | Yamaha YSM40R | 🟡 Idle |
| 4 | **Reflow Oven** | Heller 1913 MK5 | 🟢 Running |
| 5 | **AOI (Automated Optical Inspection)** | Omron VT-S730 3D | 🔴 Error |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 + Vite 6 |
| **3D Engine** | Three.js (r170) via React Three Fiber + Drei |
| **State Management** | Zustand |
| **Real-Time Communication** | Socket.io (Client + Server) |
| **Styling** | Tailwind CSS 3.4 with custom cyberpunk theme |
| **Routing** | React Router DOM v6 |
| **Backend** | Node.js + Express |
| **Fonts** | Orbitron · Inter · JetBrains Mono |

---

## 📂 Project Structure

```
smt-digital-twin/
├── index.html                  # Entry HTML with meta tags and fonts
├── package.json                # Frontend dependencies & scripts
├── vite.config.js              # Vite config with Socket.io proxy
├── tailwind.config.js          # Custom cyberpunk theme tokens
├── postcss.config.js           # PostCSS plugins
├── .env                        # Environment variables (Socket URL)
│
├── server/
│   ├── index.js                # Express + Socket.io backend server
│   └── package.json            # Server dependencies
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Router: Landing → Admin / User
    ├── index.css               # Global styles, glassmorphism, neon glows
    │
    ├── components/
    │   ├── MachineModel.jsx    # Procedural 3D geometry per machine type
    │   ├── Viewport3D.jsx      # R3F Canvas, camera, lighting, stars
    │   ├── InfoOverlay.jsx     # Machine-specific data panels
    │   ├── OEEWidget.jsx       # OEE gauge rings (SVG)
    │   ├── AdminSidebar.jsx    # Machine list + broadcast controls
    │   ├── StatusBadge.jsx     # Colored status indicator pill
    │   └── GlowRing.jsx       # Animated torus ring around models
    │
    ├── views/
    │   ├── AdminView.jsx       # Admin layout: sidebar + viewport
    │   └── UserView.jsx        # User layout: full-screen follower
    │
    ├── data/
    │   └── machines.js         # Static data for 5 SMT machines
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
git clone https://github.com/ananthu-pm/smt-digital-twin.git
cd smt-digital-twin

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

### Running the Application

```bash
# Start both frontend and backend concurrently
npm start

# Or run them individually:
npm run dev       # Frontend (Vite dev server on port 5173)
npm run server    # Backend (Socket.io server on port 4000)
```

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build
```

---

## 🖥️ Usage

| Route | View | Description |
|-------|------|-------------|
| `/` | **Landing Page** | Role selection — choose Admin or User |
| `/admin` | **Admin Dashboard** | Machine list sidebar, broadcast controls, 3D preview, OEE metrics |
| `/user` | **User View** | Full-screen follower mode with auto-synced machine display |

### Workflow

1. Open the app and select **Admin** on one device (PC)
2. Open the app and select **User** on another device (phone/tablet)
3. Admin selects a machine → All users instantly see the selected machine's 3D model and data
4. Machine status changes (Running / Idle / Error) broadcast in real-time

---

## 🎨 Design System

The app uses a custom **cyberpunk industrial theme** with:

- **Dark Background**: `#0a0a0f` (cyber-bg)
- **Neon Accents**: Cyan `#00fff5` · Magenta `#ff00ff` · Green `#39ff14`
- **Status Colors**: Running 🟢 · Idle 🟡 · Error 🔴
- **Glassmorphism**: Frosted glass panels with backdrop blur
- **Typography**: Orbitron (headings) · Inter (body) · JetBrains Mono (data)
- **Animations**: Pulse glow, slide-in, fade-in, and 3D model rotation

---

## 🔌 Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `SYNC_MACHINE` | Server → Client | `{ machineId }` | Sent on connect with current machine |
| `SYNC_MACHINE` | Client → Server | `{ machineId }` | Admin broadcasts a machine selection |
| `SYNC_MACHINE` | Server → All | `{ machineId }` | Rebroadcast to all connected clients |
| `UPDATE_STATUS` | Client → Server | `{ machineId, status }` | Admin updates a machine's status |
| `UPDATE_STATUS` | Server → All | `{ machineId, status }` | Rebroadcast status change |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ⚡ by [Ananthu P M](https://github.com/ananthu-pm)**

</div>
