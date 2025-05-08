import React, { useState, useEffect } from "react";

export default function SessionList({ onJoin }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/sessions")
      .then(res => res.json())
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Join Existing Game Session</h2>
      {loading ? (
        <div>Loading sessions...</div>
      ) : (
        <ul>
          {sessions.length === 0 && <li>No sessions available.</li>}
          {sessions.map(sess => (
            <li key={sess.sessionId}>
              {sess.originalname} ({sess.players} players)
              <button onClick={() => onJoin(sess.sessionId)} style={{ marginLeft: 12 }}>
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}