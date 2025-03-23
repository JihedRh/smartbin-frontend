import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Divider } from "@mui/material";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

interface AddHospitalFormProps {
  onClose: () => void;
}

const AddHospitalForm: React.FC<AddHospitalFormProps> = ({ onClose }) => {
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lat, setLat] = useState<number>(30);
  const [lng, setLng] = useState<number>(10);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: fieldName, value } = e.target;
    if (fieldName === "name") setName(value);
    if (fieldName === "address") setAddress(value);
  };

  const handleFormSubmit = async () => {
    if (!name || !address) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://smartbin-backend.onrender.com/api/hospitals", {
        name,
        address,
        lat,
        lng,
      });

      console.log(response.data);
      setName("");
      setAddress("");
      alert("Hospital added successfully!");
      onClose(); 
    } catch (err) {
      console.error("Error adding hospital:", err);
      setError("Failed to add hospital. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Custom hook to update lat/lng when map is clicked
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      },
    });

    return <Marker position={[lat, lng]} />;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Hospital
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Display error message if any */}
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Hospital Name Input */}
      <TextField
        fullWidth
        label="Hospital Name"
        variant="outlined"
        name="name"
        value={name}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      {/* Hospital Address Input */}
      <TextField
        fullWidth
        label="Address"
        variant="outlined"
        name="address"
        value={address}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      {/* Leaflet Map to choose location */}
      <MapContainer
        center={[lat, lng]} // Initial center of the map
        zoom={13}
        style={{ height: "300px", marginBottom: "16px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleFormSubmit}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Hospital"}
      </Button>
    </Paper>
  );
};

export default AddHospitalForm;
