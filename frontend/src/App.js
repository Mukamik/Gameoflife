import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import SessionList from "./components/SessionList";
import Emulator from "./components/Emulator";

export default function App() {
  const [sessionId, setSessionId] = useState(null);

  return (
    <div style={{ fontFamily: "sans-serif", margin: 32 }}>
      <h1>Cereal Box Board Game Emulator</h1>
      {!sessionId ? (
        <>
          <Upload onCreated={setSessionId} />
          <SessionList onJoin={setSessionId} />
        </>
      ) : (
        <Emulator sessionId={sessionId} />
      )}
    </div>
  );
}