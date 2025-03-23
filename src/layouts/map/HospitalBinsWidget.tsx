import React from "react";
import { Card, Box, Typography, Divider } from "@mui/material";
import { Iconify } from "src/components/iconify"; 

type Bin = {
  type: string;
  count: number;
};

interface HospitalBinsProps {
  hospitalName: string;
  hospitalAddress: string;
  bins: Bin[];
}

export const HospitalBinsWidget: React.FC<HospitalBinsProps> = ({ hospitalName, hospitalAddress, bins }) => {
  const totalBins = bins.reduce((total, bin) => total + bin.count, 0);

  return (
    <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{hospitalName}</Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Address: {hospitalAddress}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Total Bins: {totalBins}
      </Typography>

      <Box>
        {bins.map((bin, index) => (
          <Box key={index} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1">{bin.type}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {bin.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
