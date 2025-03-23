import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography, Paper, Divider, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import type { LatLngExpression } from "leaflet"; 
import L from "leaflet"; 
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { DashboardContent } from "../dashboard";

import "leaflet/dist/leaflet.css";

interface BinType {
    id?: number;
    reference?: string;
    functionality?: string;
    type: number;
    statut?: string;
    count: number;
  }
  
  

interface BinData {
  id: number;
  reference: string;
  functionality: string;
  type: number; 
  statut: string;
}

interface Hospital {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const HospitalDetail: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [bins, setBins] = useState<BinType[]>([]);
  const [binData, setBinData] = useState<BinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [binReferences, setBinReferences] = useState<BinType[]>([]);


  useEffect(() => {
    axios
      .get(`https://smartbin-backend.onrender.com/api/hospitals/${hospitalId}`)
      .then((response) => {
        setHospital(response.data.hospital);
        setBins(response.data.bins);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hospital details:", err);
        setLoading(false);
      });
  }, [hospitalId]);
  useEffect(() => {
    axios.get('https://smartbin-backend.onrender.com/api/bin-references-hop')
      .then((response) => {
        setBinReferences(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching bin references:', error);
      });
  }, []);
  
  useEffect(() => {
    axios
      .get(`https://smartbin-backend.onrender.com/api/binss/${hospitalId}`)
      .then((response) => {
        const binsData = Array.isArray(response.data.bins) ? response.data.bins : [];
        setBinData(binsData);
      })
      .catch((err) => {
        console.error("Error fetching bin data:", err);
      });
  }, [hospitalId]);

  const handleAddBin = () => {
    if (!selectedBin) {
      alert('Please select a bin reference.');
      return;
    }
    axios
      .post(`https://smartbin-backend.onrender.com/api/hospitals/${hospitalId}/add-bin`, { binReference: selectedBin })
      .then((response) => {
        alert('Bin added successfully!');
        setBins([...bins, { type: response.data.type, count: response.data.count }]);
      })
      .catch((err) => {
        console.error("Error adding bin:", err);
      });
  };

  const handleDeleteBin = () => {
    if (!selectedBin) {
      alert('Please select a bin reference.');
      return;
    }
    axios
      .delete(`https://smartbin-backend.onrender.com/api/hospitals/${hospitalId}/delete-bin`, { data: { binReference: selectedBin } })
      .then((response) => {
        alert('Bin deleted successfully!');
        setBins(bins.filter((bin) => bin.reference !== selectedBin));
      })
      .catch((err) => {
        console.error("Error deleting bin:", err);
      });
  };
  

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }

  if (!hospital) {
    return <Typography variant="h6" align="center" mt={5}>Hospital not found.</Typography>;
  }

  const hospitalLocation: LatLngExpression = [hospital.lat, hospital.lng];

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        backgroundImage: "url(/assets/bg_dashboard.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Left: Map */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, background: "#152238" }}>
            <Typography variant="h5" sx={{ color: "#64B5F6" }}>
              Location
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: "#64B5F6" }} />
            <MapContainer center={hospitalLocation} zoom={14} style={{ height: "400px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={hospitalLocation}
                icon={new L.Icon({
                  iconUrl: markerIcon,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: markerShadow,
                  shadowSize: [41, 41],
                })}
              />
            </MapContainer>
          </Paper>
        </Grid>

        {/* Right: Hospital Info & Bins */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, background: "#D3D3D3" }}>
            <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
              {hospital.name}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
              Address: {hospital.address}
            </Typography>
            <Divider sx={{ mb: 2, bgcolor: "#64B5F6" }} />
            <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
              Total Bins: {bins.reduce((total, bin) => total + bin.count, 0)}
            </Typography>
            <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
  <InputLabel id="bin-select-label">Select Bin Reference</InputLabel>
  <Select
    labelId="bin-select-label"
    value={selectedBin}
    onChange={(e) => setSelectedBin(e.target.value)}
    label="Select Bin Reference"
  >
    {binReferences.map((bin) => (
      <MenuItem key={bin.id} value={bin.reference}>
        {bin.reference} {/* Display the bin reference here */}
      </MenuItem>
    ))}
  </Select>
</FormControl>




              <Box sx={{ mt: 2 }}>
                <Button variant="contained" sx={{ mr: 2 }} onClick={handleAddBin}>
                  Add Bin to Hospital
                </Button>
                <Button variant="contained" color="error" onClick={handleDeleteBin}>
                  Delete Bin from Hospital
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bin Table */}
      <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } , color: 'white' }}>
          Smart Trash Bins of  {hospital.name}
        </Typography>
        <TableContainer component={Paper} sx={{ background: "#152238", boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#1E3A5F" }}>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>Reference</TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>Functionality</TableCell>
                <TableCell sx={{ color: "black", fontWeight: "bold" }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {binData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: "center", color: "white" }}>
                    No bin data available
                  </TableCell>
                </TableRow>
              ) : (
                binData.map((bin) => (
                  <TableRow key={bin.id}>
                    <TableCell sx={{ color: "white" }}>{bin.reference}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {bin.functionality}
                      <button
                        type="button"
                        style={{
                          backgroundColor: bin.functionality === 'ok' ? 'green' : 'red',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginLeft: '10px',
                        }}
                      >
                        {bin.functionality === 'ok' ? 'Good' : 'Bad'}
                      </button>
                    </TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {bin.type === 1 ? "OR bin" : bin.type === 2 ? "Hall Bin" : "Unknown"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardContent>
  );
};

export default HospitalDetail;
