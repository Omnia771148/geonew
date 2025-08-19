"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);
  const [savedLink, setSavedLink] = useState(null);

  const requestLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lon: longitude });

          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setSavedLink(mapLink);

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
        (err) => setError(err.message)
      );
    } else {
      setError("Geolocation is not supported in this browser");
    }
  };

  // Try auto-fetching location on page load
  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div>
      <h1>Saved Location</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <p>{savedLink || "No saved location found"}</p>

      {/* Show button ONLY if location not detected */}
      {!savedLink && (
        <button
          onClick={requestLocation}
          style={{ marginTop: "10px", padding: "8px 16px" }}
        >
          Get My Location
        </button>
      )}
    </div>
  );
}
