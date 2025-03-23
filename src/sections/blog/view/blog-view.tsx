import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Typography, Autocomplete, TextField } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { Iconify } from "src/components/iconify";
import { OperationRoomBinWidget } from "./OperationRoomBinWidget";
import WasteLineChart from "./WasteLineChart";

// Define type for Bin
type Bin = {
  reference: string;
  location: string;
  toxic_waste: number;
  non_toxic_waste: number;
  organic_waste: number;
};

export function BlogView() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);

  useEffect(() => {
    axios.get("https://smartbin-backend.onrender.com/bins")
      .then((res) => {
        const binsData = res.data as Bin[];
        const uniqueBins = Array.from(new Map(binsData.map((bin) => [bin.reference, bin])).values());
        setBins(uniqueBins);
      })
      .catch((err) => console.error("Error fetching bins:", err));
  }, []);

  return (
    <DashboardContent maxWidth="xl" sx={{
      backgroundImage: 'url(/assets/bg_dashboard.jpg)',
      backgroundSize: 'cover', 
      backgroundPosition: 'center',  
      backgroundRepeat: 'no-repeat',
    
    }}>

      {/* Header */}
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1} color="white" sx={{ fontWeight: 'bold', transition: 'color 0.3s ease' }}>
          Smart Trash Bins
        </Typography>
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="mingcute:add-line" />}>
          Add New Bin
        </Button>
      </Box>

      {/* Bin Selection */}
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 5, width: '100%' }}>
        <Autocomplete
          options={bins}
          getOptionLabel={(option) => option.reference}
          value={selectedBin}
          onChange={(event, newValue) => setSelectedBin(newValue)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Select Bin" 
              variant="outlined" 
              InputProps={{
                ...params.InputProps,
                style: { backgroundColor: 'white' }
              }}
            />
          )}
          sx={{ width: '250px' }}
        />
      </Box>

      {/* Waste Widgets */}
      <Box display="flex" justifyContent="space-around" flexWrap="wrap" gap={3} sx={{ transition: 'all 0.3s ease-in-out' }}>
        <OperationRoomBinWidget
          icon={<Iconify width={60} icon="mdi:biohazard" sx={{ color: 'red' }} />}
          binReference={selectedBin?.reference || "N/A"}
          totalWaste={selectedBin?.toxic_waste || 0}
          wasteType="Toxic Waste"
          trendPercent={Math.random() * 10 - 5}
          color="error"
          chart={{ series: [selectedBin?.toxic_waste || 0], categories: ["Toxic"] }}
        />
        <OperationRoomBinWidget
          icon={<Iconify width={60} icon="mdi:recycle" sx={{ color: 'blue' }} />}
          binReference={selectedBin?.reference || "N/A"}
          totalWaste={selectedBin?.non_toxic_waste || 0}
          wasteType="Non-Toxic Waste"
          trendPercent={Math.random() * 10 - 5}
          color="warning"
          chart={{ series: [selectedBin?.non_toxic_waste || 0], categories: ["Non-Toxic"] }}
        />
        <OperationRoomBinWidget
          icon={<Iconify width={60} icon="mdi:leaf" sx={{ color: 'green' }} />}
          binReference={selectedBin?.reference || "N/A"}
          totalWaste={selectedBin?.organic_waste || 0}
          wasteType="Organic Waste"
          trendPercent={Math.random() * 10 - 5}
          color="success"
          chart={{ series: [selectedBin?.organic_waste || 0], categories: ["Organic"] }}
        />
      </Box>

      {/* Waste Line Chart */}
      <Box sx={{ mt: 5 }}>
        <WasteLineChart reference={selectedBin?.reference || "BIN-001"} />
      </Box>
    </DashboardContent>
  );
}
