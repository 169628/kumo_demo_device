# kumo_demo_device

A browser-based IoT device simulator for the **Kumo OTA Update System**. It mimics real IoT devices by establishing STOMP over SockJS WebSocket connections to the backend, allowing you to manually trigger OTA update status events (downloading, downloaded, reboot, succeeded, failed) and observe the real-time response from the server.

---

## Related Repositories

| Name | Repo | Description |
|------|------|-------------|
| `kumo_frontend` | https://github.com/169628/kumo_frontend | Admin UI — Campaign CRUD, device list, report dashboard |
| `kumo_demo_device` **(this repo)** | https://github.com/169628/kumo_demo_device | Simulated IoT device — connects via WebSocket and reports update status |
| `kumo_backend` | https://github.com/169628/kumo_backend | Spring Boot backend — REST API & WebSocket service |

---

## Project Overview

`kumo_demo_device` is a **pure front-end static page** (no build step required). It renders up to **3 simultaneous device cards** in the browser. Each card independently:

1. Fills in device metadata (Brand, Model, Software Version, Serial Number).
2. Clicks **Connect** to open a STOMP/SockJS WebSocket session with the backend.
3. Selects an OTA status and clicks **Send** to push a status update message.
4. Displays real-time server responses in an in-page console.
5. Clicks **Close Connect** to gracefully disconnect.

---

## Folder Structure

```
kumo_demo_device/
├── css/
│   └── index.css          # Page styles
├── js/
│   └── index.js           # WebSocket / STOMP logic & UI interactions
├── index.html             # Main (and only) page
├── package.json           # Node dependencies (used for local dev server)
└── package-lock.json
```

---

## Tech Stack & Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML / CSS / JavaScript | — | Static front-end, no framework |
| jQuery | 3.7.1 (CDN) | DOM manipulation |
| SockJS-client | 1.6.1 (CDN + npm) | WebSocket fallback transport |
| stompjs | 2.3.3 (CDN) | STOMP messaging protocol over SockJS |
| @stomp/stompjs | ^7.3.0 (npm) | STOMP client (npm reference) |
| ws | ^8.18.3 (npm) | Node.js WebSocket (dev utility) |
| Node.js | ≥ 18 recommended | Local development server |

> CDN libraries are loaded directly in `index.html`; npm packages in `package.json` are available for local tooling.

---

## Getting Started

### Prerequisites

- **Git** installed
- **Node.js ≥ 18** installed — download from https://nodejs.org
- The **kumo_backend** service must be running locally on port `8080` before you open this page

### Step 1 — Clone the repository

```bash
git clone https://github.com/169628/kumo_demo_device.git
cd kumo_demo_device
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the backend first

Make sure `kumo_backend` is running and accessible at `http://localhost:8080`.
Refer to the [kumo_backend README](https://github.com/169628/kumo_backend) for setup instructions.

### Step 4 — Open the page

Because the page uses CDN scripts, you need to serve it over HTTP (not open `index.html` directly as a `file://` URL, which browsers may block).

**Option A — Use the VS Code Live Server extension (recommended)**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.
2. Right-click `index.html` → **Open with Live Server**.
3. Your browser will open at `http://127.0.0.1:5500` automatically.

**Option B — Use npx serve**

```bash
npx serve .
```

Then open the URL shown in the terminal (e.g. `http://localhost:3000`).

---

## How to Use

1. **Fill in a device card** — choose Brand, Model, enter a Software Version (e.g. `V1.0`) and a Serial Number (e.g. `BB251021`).
2. **Click Connect** — the card's indicator light turns green and blinks when the WebSocket session is established.
3. **Select an OTA status** — choose one of: `downloading`, `downloaded`, `reboot`, `succeeded`, `failed`.
4. **Click Send** — the status is pushed to the backend. The server response appears in the Console panel below the form.
5. **Click Close Connect** — gracefully ends the WebSocket session and resets the card.
6. Repeat with the other two cards to simulate up to **3 concurrent devices**.

---

## Backend API

The page connects to:

```
ws://localhost:8080/kumo/api/endpoint   (SockJS)
```

| Direction | STOMP destination | Description |
|-----------|-------------------|-------------|
| Device → Server | `/connect/device/{sn}` | Send device info & OTA status |
| Server → Device | `/msg/{sn}` | Receive session token & response data |
