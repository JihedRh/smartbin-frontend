import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

interface BinFunctionalityData {
  functionality: string;
  count: number;
}

const PieActiveArc = () => {
  const [binData, setBinData] = useState<{ label: string; value: number }[]>([
    { label: 'ok', value: 0 },
    { label: 'no ok', value: 0 },
  ]);

  useEffect(() => {
    axios
      .get<BinFunctionalityData[]>('https://smartbin-backend.onrender.com/api/bin-functionality')
      .then((response) => {
        const data = response.data;
        const okCount = data.find((item) => item.functionality === 'ok')?.count || 0;
        const noOkCount = data.find((item) => item.functionality === 'no ok')?.count || 0;
        const totalCount = okCount + noOkCount;

        // Calculate the percentage for each
        setBinData([
          { label: 'ok', value: totalCount ? (okCount / totalCount) * 100 : 0 },
          { label: 'no ok', value: totalCount ? (noOkCount / totalCount) * 100 : 0 },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching bin functionality data:', error);
      });
  }, []);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: '#D3D3D3',
        borderRadius: '16px',
        padding: '16px',
      }}
    >
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, color: 'black' }}>
        Percentage of Working Bins
      </Typography>
      <PieChart
        series={[
          {
            data: binData,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter: (value) => {
              // Ensure that value is a number
              const numericValue = typeof value === 'object' ? Number(value.value) : Number(value);
              return Number.isNaN(numericValue) ? 'N/A' : `${numericValue.toFixed(2)}%`;
            },
          },
        ]}
        height={200}
      />
    </Grid>
  );
};

export default PieActiveArc;
