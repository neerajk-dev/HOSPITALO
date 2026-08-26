import React, { useContext, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AppContext } from "../context/AppContext";

const NearbyPharmacy = () => {
  const [location, setLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  const { backendUrl } = useContext(AppContext);

  // =========================
  // SEO
  // =========================
  useEffect(() => {
    const title =
      "Nearby Pharmacies - Find Pharmacies Near You | Hospitalo";

    const description =
      "Find nearby pharmacies using Hospitalo. Get pharmacy locations, view them on an interactive map, and get directions using your current location.";

    const canonicalUrl =
      "https://hospitalo-yjlj.onrender.com/nearby-pharmacy";

    document.title = title;

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    );

    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute("content", description);

    let canonicalTag = document.querySelector(
      'link[rel="canonical"]'
    );

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", canonicalUrl);

    return () => {
      document.title =
        "Hospitalo - Smart Hospital Management & Appointment System";
    };
  }, []);

  // =========================
  // Get user location
  // =========================
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setLocation({
          latitude,
          longitude,
        });
      },
      () => {
        alert(
          "Please enable location access to find nearby pharmacies."
        );
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // =========================
  // Fetch nearby pharmacies
  // =========================
  useEffect(() => {
    if (location) {
      fetchNearbyPharmacies();
    }
  }, [location]);

  const fetchNearbyPharmacies = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/pharmacy?lat=${location.latitude}&lon=${location.longitude}`
      );

      const data = await res.json();

      setPharmacies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(
        "Frontend Pharmacy Error:",
        err
      );

      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Map Icons
  // =========================
  const userIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [32, 32],
  });

  const pharmacyIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    iconSize: [30, 30],
  });

  // =========================
  // Show More
  // =========================
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <main className="p-6 space-y-8">
      {/* =========================
          Page Heading
      ========================= */}
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Hospitalo Healthcare Services
        </p>

        <h1 className="mt-2 text-3xl font-bold text-blue-600">
          Find Nearby Pharmacies
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Find pharmacies near your current location using
          Hospitalo's interactive pharmacy locator. View nearby
          pharmacy locations on the map and get directions easily.
        </p>
      </header>

      {/* =========================
          Loading
      ========================= */}
      {loading && (
        <section
          className="rounded-xl border border-blue-100 bg-blue-50 p-5"
          aria-live="polite"
        >
          <p className="text-gray-700">
            Finding pharmacies near you...
          </p>
        </section>
      )}

      {/* =========================
          No Pharmacies
      ========================= */}
      {!loading && pharmacies.length === 0 && (
        <section className="rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            No nearby pharmacies found
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We could not find pharmacies near your current
            location. Please make sure location access is enabled
            and try again.
          </p>
        </section>
      )}

      {/* =========================
          Map View
      ========================= */}
      {location && pharmacies.length > 0 && (
        <section
          aria-label="Nearby pharmacy map"
          className="space-y-3"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Pharmacies Near Your Location
          </h2>

          <div className="overflow-hidden rounded-xl">
            <MapContainer
              center={[
                location.latitude,
                location.longitude,
              ]}
              zoom={14}
              style={{
                height: "400px",
                width: "100%",
                zIndex: 10,
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* User Location */}
              <Marker
                position={[
                  location.latitude,
                  location.longitude,
                ]}
                icon={userIcon}
              >
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>

              {/* Pharmacy Markers */}
              {pharmacies
                .slice(0, visibleCount)
                .map((pharmacy, index) => (
                  <Marker
                    key={index}
                    position={[
                      pharmacy.lat,
                      pharmacy.lon,
                    ]}
                    icon={pharmacyIcon}
                  >
                    <Popup>
                      <strong>
                        {pharmacy.display_name?.split(
                          ","
                        )[0] || "Nearby Pharmacy"}
                      </strong>

                      <br />

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lon}`}
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
          </div>
        </section>
      )}

      {/* =========================
          Pharmacy List
      ========================= */}
      {pharmacies.length > 0 && (
        <section aria-label="Nearby pharmacies">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Nearby Pharmacy List
          </h2>

          <div className="space-y-3">
            {pharmacies
              .slice(0, visibleCount)
              .map((pharmacy, index) => (
                <article
                  key={index}
                  className="rounded-xl border border-gray-200 p-4 shadow-md transition-all hover:shadow-lg dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                    {pharmacy.display_name?.split(
                      ","
                    )[0] || "Nearby Pharmacy"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {pharmacy.display_name ||
                      "Pharmacy location"}
                  </p>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-500 underline"
                  >
                    📍 Get Directions
                  </a>
                </article>
              ))}

            {/* =========================
                Show More
            ========================= */}
            {visibleCount < pharmacies.length && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={handleShowMore}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                  Show More Pharmacies
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================
          Informational Content
      ========================= */}
      <section className="rounded-2xl bg-blue-50 p-6 dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Find Pharmacies Quickly With Hospitalo
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Hospitalo helps patients locate nearby pharmacies based
          on their current location. You can view pharmacy
          locations on an interactive map and open Google Maps for
          directions.
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
          Location services must be enabled in your browser to
          find pharmacies around you.
        </p>
      </section>
    </main>
  );
};

export default NearbyPharmacy;