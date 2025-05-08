import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Emulator({ sessionId }) {
  const [playerCount, setPlayerCount] = useState(1);
  const socketRef = useRef();

  useEffect(() => {
    // Connect to backend socket
    const socket = io("http://localhost:4000");
    socket.emit("join-session", { sessionId });
    socket.on("player-count", setPlayerCount);
    socketRef.current = socket;

    // Example: listen for multiplayer actions
    socket.on("player-action", ({ playerId, action }) => {
      // Handle game state updates here
      // For demo: just log
      console.log("Action from", playerId, action);
    });

    return () => socket.disconnect();
  }, [sessionId]);

  // Placeholder: Provide the ISO download URL for the embedded emulator
  const isoUrl = `http://localhost:4000/api/session/${sessionId}/iso`;

  return (
    <div>
      <h2>Game Session: {sessionId}</h2>
      <div>Players connected: {playerCount}</div>
      {/* Emulator embed placeholder */}
      <div style={{
        marginTop: 24,
        border: "2px solid #888",
        padding: 12,
        minHeight: 360
      }}>
        <em>
          Emulator would load ISO from: <a href={isoUrl}>{isoUrl}</a>
        </em>
        {/* Example: Embed EmulatorJS/RetroArch iframe or script here */}
      </div>
      {/* Example controls for demo purpose */}
      <button
        onClick={() =>
          socketRef.current.emit("player-action", { sessionId, action: "move-piece" })
        }
        style={{ marginTop: 16 }}
      >
        Send Example Action
      </button>
    </div>
  );
}