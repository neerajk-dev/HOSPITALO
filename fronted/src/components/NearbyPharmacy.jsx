import React, { useContext, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AppContext } from "../context/AppContext";

const NearbyPharmacy = () => {
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  const { backendUrl } = useContext(AppContext);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
      },
      () => alert("Please enable location access to find nearby pharmacies.")
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) fetchNearbyPharmacies();
  }, [location]);

  const fetchNearbyPharmacies = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendUrl}/api/pharmacy?lat=${location.latitude}&lon=${location.longitude}`
      );
      const data = await res.json();
      setPharmacies(data);
    } catch (err) {
      console.error("Frontend Pharmacy Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [32, 32],
  });

  const pharmacyIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    iconSize: [30, 30],
  });

  // 👇 Function to handle "Show More" click
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4); // show next 4
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600">
        🏥 Nearby Pharmacies
      </h2>

      {loading && <p>Fetching pharmacies near you...</p>}

      {!loading && pharmacies.length === 0 && (
        <p>No pharmacies found nearby.</p>
      )}

      {/* Map View */}
      {location && pharmacies.length > 0 && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={14}
          style={{
            height: "400px",
            width: "100%",
            borderRadius: "12px",
            zIndex: 10,
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[location.latitude, location.longitude]}
            icon={userIcon}
          >
            <Popup>You are here</Popup>
          </Marker>

          {pharmacies.slice(0, visibleCount).map((p, i) => (
            <Marker key={i} position={[p.lat, p.lon]} icon={pharmacyIcon}>
              <Popup>
                <strong>{p.display_name.split(",")[0]}</strong>
                <br />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Get Directions
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {/* List View */}
      {pharmacies.length > 0 && (
        <div className="space-y-3">
          {pharmacies.slice(0, visibleCount).map((p, i) => (
            <div
              key={i}
              className="border border-gray-200 shadow-md p-4 rounded-xl hover:shadow-lg transition-all"
            >
              <p className="font-semibold text-gray-800 dark:text-gray-300">
                {p.display_name.split(",")[0]}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {p.display_name}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-1 inline-block"
              >
                📍 Get Directions
              </a>
            </div>
          ))}

          {/* Show More Button */}
          {visibleCount < pharmacies.length && (
            <div className="text-center mt-4">
              <button
                onClick={handleShowMore}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyPharmacy;