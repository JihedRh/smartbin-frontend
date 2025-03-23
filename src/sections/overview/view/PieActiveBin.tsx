import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';

interface SmartTrashBinData {
  type: string;
  count: number;
}

const PieActiveBin = () => {
  const [binData, setBinData] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    axios
      .get<SmartTrashBinData[]>('https://smartbin-backend.onrender.com/api/smart-trash-bin/types')
      .then((response) => {
        const data = response.data;
        console.log('API Response Data:', data);
        
        const totalCount = data.reduce((sum, item) => sum + item.count, 0);

        const normalizedData = data.map((item) => {
          const label =
            item.type === '1' ? 'Operation Room Bins' : item.type === '2' ? 'Hall bins' : 'Unknown';
          const value = totalCount ? (item.count / totalCount) * 100 : 0;
          return { label: String(label), value }; 
        });

        setBinData(normalizedData);
      })
      .catch((error) => {
        console.error('Error fetching smart trash bin data:', error);
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
        Percentage of Trash Bin Types
      </Typography>
      <PieChart
        series={[
          {
            data: binData,
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            valueFormatter: (value) => {
              const numericValue = typeof value === 'object' ? Number(value.value) : Number(value);

              const formattedValue = Number.isNaN(numericValue)
                ? 'N/A'
                : `${numericValue.toFixed(2)}%`;

              return formattedValue; // Return formatted percentage without custom labels based on type
            },
          },
        ]}
        height={200}
      />
    </Grid>
  );
};

export default PieActiveBin;
