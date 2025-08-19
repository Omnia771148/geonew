"use client";

import { useState } from "react";

export default function Home() {
  const [savedLink, setSavedLink] = useState(null);
  const [error, setError] = useState(null);

  const requestLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setSavedLink(mapLink);
          setError(null);

          try {
            const res = await fetch("/api/save-location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: mapLink }),
            });

            const data = await res.json();
            if (data.success) console.log("Location saved to MongoDB!");
            else console.error("MongoDB save failed:", data.error);
          } catch (err) {
            console.error("Error sending to API:", err);
          }
        },
        () => setError("Please turn on your location in settings.")
      );
    } else {
      setError("Please turn on your location in settings.");
    }
  };

  return (
    <div>
      {savedLink && <p>{savedLink}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!savedLink && !error && (
        <button
          onClick={requestLocation}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Get My Current Location
        </button>
      )}
    </div>
  );
}
