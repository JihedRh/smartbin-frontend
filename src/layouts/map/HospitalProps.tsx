import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

interface HospitalProps {
  name: string;
  image: string;
  bins: number;
}

const HospitalCard: React.FC<HospitalProps> = ({ name, image, bins }) => (
  <Card
    sx={{
      width: 280,
      height: 360,
      borderRadius: 6,  
      boxShadow: 3,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: 6,
      },
      backgroundColor: "#fff",  
      marginBottom: 3, // Added marginBottom for spacing between rows
    }}
  >
    <CardMedia
      component="img"
      height="180"
      image={image}
      alt={name}
      sx={{
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
      }}
    />
    <CardContent>
      <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: "#333" }}>
        {name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
          Number of Bins: {bins}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default HospitalCard;
