import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/*
 * Windows 98 emulation in browser using v86
 * - BIOS files are fetched from copy.sh public servers for demo purposes.
 * - User's ISO is loaded from the backend session.
 * - Multiplayer sync still via socket.io as before.
 * - This is EXPERIMENTAL and will be slow; real Windows 98 board games may not always run.
 */

export default function Emulator({ sessionId }) {
  const [playerCount, setPlayerCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [v86Init, setV86Init] = useState(false);
  const emuScreenRef = useRef();
  const socketRef = useRef();
  const v86Ref = useRef();

  useEffect(() => {
    // Multiplayer socket.io setup
    const socket = io("http://localhost:4000");
    socket.emit("join-session", { sessionId });
    socket.on("player-count", setPlayerCount);
    socketRef.current = socket;

    socket.on("player-action", ({ playerId, action }) => {
      // Handle multiplayer sync here, if possible (can be extended)
      console.log("Action from", playerId, action);
    });

    return () => socket.disconnect();
  }, [sessionId]);

  // Load and start v86 when user clicks "Start Emulator"
  async function startEmulator() {
    setLoading(true);
    if (v86Ref.current) {
      // Prevent multiple inits
      setLoading(false);
      return;
    }
    // BIOS and VGA BIOS files from copy.sh public servers (for demo)
    const biosUrl =
      "https://copy.sh/v86/bios/seabios.bin";
    const vgaBiosUrl =
      "https://copy.sh/v86/bios/vgabios.bin";
    // The ISO from backend
    const isoUrl = `http://localhost:4000/api/session/${sessionId}/iso`;

    // Fetch BIOS files as ArrayBuffers
    async function fetchBuffer(url) {
      const res = await fetch(url);
      return await res.arrayBuffer();
    }

    // Fetch all files in parallel
    const [bios, vga_bios] = await Promise.all([
      fetchBuffer(biosUrl),
      fetchBuffer(vgaBiosUrl),
    ]);

    // Fetch ISO as ArrayBuffer
    const isoRes = await fetch(isoUrl);
    const isoBuffer = await isoRes.arrayBuffer();

    // Initialize v86
    setTimeout(() => {
      v86Ref.current = new window.V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 128 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: emuScreenRef.current,
        bios: { buffer: bios },
        vga_bios: { buffer: vga_bios },
        cdrom: { buffer: isoBuffer },
        autostart: true,
        // You can add more options here as needed
      });
      setV86Init(true);
      setLoading(false);
    }, 100); // Give React time to render screen container
  }

  return (
    <div>
      <h2>Game Session: {sessionId}</h2>
      <div>Players connected: {playerCount}</div>
      <div style={{
        marginTop: 24,
        border: "2px solid #888",
        padding: 0,
        minHeight: 380,
        minWidth: 640,
        background: "#111"
      }}>
        {/* Emulator display */}
        <div ref={emuScreenRef} style={{ width: 640, height: 380 }} />
        {!v86Init && (
          <button onClick={startEmulator} disabled={loading} style={{ margin: 16 }}>
            {loading ? "Loading..." : "Start Windows 98 Emulator"}
          </button>
        )}
        {v86Init && (
          <div style={{ color: "#ccc", margin: 8 }}>
            Windows 98 is booting from your ISO (experimental).
          </div>
        )}
      </div>
      {/* Multiplayer demo action */}
      <button
        onClick={() =>
          socketRef.current.emit("player-action", { sessionId, action: "move-piece" })
        }
        style={{ marginTop: 16 }}
      >
        Send Example Action
      </button>
      <div style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
        <b>Note:</b> Windows 98 emulation is experimental and slow in the browser.<br />
        Only use legal BIOS and disc images. Some games may not be compatible.
      </div>
    </div>
  );
}