"use client";

import { useState } from "react";

export default function Home() {
  const [savedLink, setSavedLink] = useState(null);
  const [error, setError] = useState(null);

  // Kurnool City boundary (not full district)
  const minLat = 15.40;
  const maxLat = 16.20;
  const minLon = 78.00;
  const maxLon = 78.12;

  const requestLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          // Check if inside city boundary
          const inside =
            latitude >= minLat &&
            latitude <= maxLat &&
            longitude >= minLon &&
            longitude <= maxLon;

          if (inside) {
            setSavedLink(mapLink);
            setError(null);

            try {
              const res = await fetch("/api/save-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: mapLink }),
              });

              const data = await res.json();
              if (data.success) console.log("✅ Location saved to MongoDB!");
              else console.error("❌ MongoDB save failed:", data.error);
            } catch (err) {
              console.error("Error sending to API:", err);
            }
          } else {
            setError("❌ You are outside Kurnool City premises");
            setSavedLink(null);
          }
        },
        () => setError("⚠️ Please turn on your location in settings."),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000,
        }
      );
    } else {
      setError("⚠️ Geolocation is not supported on this device.");
    }
  };

  return (
    <div>
      {savedLink && <p>✅ {savedLink}</p>}
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
