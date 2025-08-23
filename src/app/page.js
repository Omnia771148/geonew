"use client";

import { useState } from "react";

export default function Home() {
  const [savedLink, setSavedLink] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);  // 👈 added state for distance

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const requestLocation = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          const refLat = 15.828697;
          const refLon = 78.038401;

          const radius = 5;

          const dist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            refLat,
            refLon
          );

          setDistance(dist.toFixed(2));  // 👈 save distance (2 decimal places)

          if (dist <= radius) {
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
          } else {
            setError("You are outside Kurnool city premises ❌");
            setSavedLink(null);
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
      {distance && <p>📏 Distance from Kurnool center: {distance} km</p>} {/* 👈 show distance */}

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
