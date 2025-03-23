import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box, Button, CircularProgress, Dialog } from "@mui/material";
import axios from "axios";
import { Iconify } from "src/components/iconify";

import AddHospitalForm from "./AddHospitalForm"; 
import HospitalList from "./HospitalList"; 
import { DashboardContent } from "../dashboard";

interface Hospital {
  id: number;
  name: string;
  image: string;
  binCount: number;
}

const MapView: React.FC = () => {
  const [hospitalLocations, setHospitalLocations] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const hospitalResponse = await axios.get("https://smartbin-backend.onrender.com/api/hospitals");
        const hospitalsWithBinCount = await Promise.all(
          hospitalResponse.data.map(async (hospital: Hospital) => {
            try {
              const binResponse = await axios.get(
                `https://smartbin-backend.onrender.com/api/bins/count?hospital_id=${hospital.id}`
              );
              return {
                ...hospital,
                binCount: binResponse.data.bin_count,
              };
            } catch (err) {
              console.error("Error fetching bin count for hospital", hospital.id);
              return { ...hospital, binCount: 0 }; // Default bin count
            }
          })
        );
        setHospitalLocations(hospitalsWithBinCount);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch locations");
        setLoading(false);
      }
    };

    fetchLocations(); 
  }, []);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.3)",
          position: "absolute",
          width: "100%",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  if (error)
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        backgroundImage: 'url(/assets/bg_dashboard.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container sx={{ mt: 4 }} maxWidth={false}>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, color: 'white' }}>
          Hospitals List
        </Typography>
        {/*}
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleDialogOpen}
        >
          New Trash Bin
        </Button>*/}

        {/* Full-width grid for Hospital List */}
        <Grid container spacing={3} sx={{ width: '100%' }}>
          <Grid item xs={12} md={6}>
            <HospitalList hospitals={hospitalLocations} />
          </Grid>
        </Grid>

        {/* Dialog for adding a new hospital */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <AddHospitalForm onClose={handleDialogClose} />
        </Dialog>
      </Container>
    </DashboardContent>
  );
};

export default MapView;
