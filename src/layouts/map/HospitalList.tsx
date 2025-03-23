import React, { useEffect, useState } from "react";
import { Grid, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HospitalCard from "./HospitalProps";

interface Hospital {
  id: number;
  name: string;
  binCount: number;
  image: string;
}

interface HospitalListProps {
  hospitals: Hospital[];
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals }) => {
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    setImagePaths([
      "/hop/hospital1.jpg", 
      "/hop/hospital2.jpg",
      "/hop/hospital3.jpg",
      "/hop/hospital4.jpg"
    ]);
  }, []);

  const getRandomImage = () =>
    imagePaths[Math.floor(Math.random() * imagePaths.length)];

  if (!hospitals || hospitals.length === 0) {
    return <Typography color="error">No hospitals available</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }} maxWidth={false}>
      <Grid container spacing={4}>
        {hospitals.map((hospital) => (
          <Grid item xs={12} sm={6} md={4} key={hospital.id}>
            <Link to={`/hospital/${hospital.id}`} style={{ textDecoration: "none" }}>
              <HospitalCard
                name={hospital.name}
                image={getRandomImage()}
                bins={hospital.binCount}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HospitalList;
