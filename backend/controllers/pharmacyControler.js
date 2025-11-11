import express from "express";
import axios from "axios";

// Haversine formula (earth distance in km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const nearbyPharmacyRouter = async (req, res) => {
     try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const viewbox = [
      parseFloat(lon) - 0.05,
      parseFloat(lat) + 0.05,
      parseFloat(lon) + 0.05,
      parseFloat(lat) - 0.05,
    ].join(",");

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=medical&bounded=1&limit=30&viewbox=${viewbox}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Hospitalo/1.0 (neerajkr145518@gmail.com)",
      },
    });

    // ✅ Filter by distance <= 3 km
    const filtered = response.data.filter((p) => {
      if (!p.lat || !p.lon) return false;
      const dist = getDistance(lat, lon, p.lat, p.lon);
      return dist <= 3; // within 3 km radius
    });

    res.json(filtered);
  } catch (err) {
    console.error("Pharmacy API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch nearby pharmacies" });
  }
};

export { nearbyPharmacyRouter };