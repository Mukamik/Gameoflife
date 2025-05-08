# Cereal Box Board Game Emulator - Multiplayer Web Application

This project lets multiple players upload, emulate, and play cereal box board games (ISO in ZIP) together online, with concurrent sessions and multiplayer synchronization.

---

## Windows 98 Game Support

**This app supports disc images that only run on Windows 98!**

- When you create or join a session and upload a Windows 98 game ISO, the web app uses the [v86](https://github.com/copy/v86) emulator to boot a virtual PC.
- This allows you to run Windows 98 and your game directly in the browser.
- BIOS files are fetched from public servers for demo use.
- Note: Windows 98 emulation in the browser is experimental and slow. Not all games will work, and performance may vary.

**Legal note:** Only use BIOS and disc images you are legally permitted to use. This app fetches public BIOS files for demonstration. For production or private use, provide your own legal BIOS.

---

## Features

- Upload ZIP containing ISO of a board game.
- Create or join game sessions; multiple games can run at once.
- Embedded emulator in browser (integrate EmulatorJS/RetroArch as needed).
- Multiplayer sync via WebSockets; actions are shared with all players in session.
- Backend in Node.js/Express + Socket.IO, containerized with Docker.
- Frontend in React, deployable to static hosting (Netlify/Vercel/GitHub Pages).

---

## Local Development

### Prerequisites

- Node.js 18+ (for both backend and frontend)
- Docker (optional, for backend deployment)

### 1. Backend

```bash
cd backend
npm install
npm start
```

By default, backend runs on `http://localhost:4000`.

#### Docker build/run:

```bash
cd backend
docker build -t cerealbox-backend .
docker run -p 4000:4000 cerealbox-backend
```

### 2. Frontend

```bash
cd frontend
npm install
npm run build
npx serve -s public
```

Then visit `http://localhost:3000` (or the port shown by `serve`).

---

## Deployment

- **Backend**: Deploy Docker image on a VPS or cloud provider. Expose port 4000.
- **Frontend**: Deploy `/frontend/public` as a static site to Netlify, Vercel, or GitHub Pages.

---

## Emulator Integration

This scaffold provides a placeholder for embedding an emulator. To enable real emulation:
- Integrate [EmulatorJS](https://github.com/emulatorjs/emulatorjs) or [RetroArch WebAssembly](https://web.libretro.com/) in `frontend/src/components/Emulator.js`.
- Load the ISO file via the session's download URL (see Emulator.js for example).
- BIOS handling and system-specific configuration may be required for some games.

---

## API Overview

- `POST /api/upload` - Upload ZIP file, returns `{ sessionId }`
- `GET /api/sessions` - List current sessions
- `POST /api/join` - Join a session
- `GET /api/session/:sessionId/iso` - Download ISO for emulator

WebSocket events:
- `join-session` - Join multiplayer room
- `player-action` - Broadcast in-session actions

---

## Security/Production notes

- This demo keeps session state/files in memory/uploads folder; use persistent storage in production.
- Add authentication, HTTPS, and input validation before deploying to the public internet.

---

## License

MIT
