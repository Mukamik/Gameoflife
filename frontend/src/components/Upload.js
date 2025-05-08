import React, { useRef, useState } from "react";

export default function Upload({ onCreated }) {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    const file = fileRef.current.files[0];
    if (!file) {
      setError("Choose a ZIP file with ISO image.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("isozip", file);
    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.sessionId) {
        onCreated(data.sessionId);
      } else {
        setError("Upload failed");
      }
    } catch (err) {
      setError("Upload error: " + err.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} style={{ marginBottom: 24 }}>
      <h2>Start a New Game Session</h2>
      <input type="file" ref={fileRef} accept=".zip" disabled={loading} />
      <button type="submit" disabled={loading}>Upload & Create Session</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}