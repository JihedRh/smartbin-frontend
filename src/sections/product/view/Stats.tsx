import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { BarChart } from '@mui/x-charts';

// Import icons
import tempIcon from '../../../../public/assets/icons8-temperature-64.png';
import co2Icon from '../../../../public/assets/icons8-co2-96.png';
import fillLevelIcon from '../../../../public/assets/icons8-volume-level-96.png';
import humidityIcon from '../../../../public/assets/icons8-humidity-64.png';

interface BinData {
  timestamp: string;
  temperature: number;
  humidity: number;
  co2_level: number;
  fill_level: number;
}

const Stats: React.FC = () => {
  const [binData, setBinData] = useState<BinData[]>([]);
  const [binReferences, setBinReferences] = useState<string[]>([]);
  const [selectedReference, setSelectedReference] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filteredData, setFilteredData] = useState<BinData[]>([]);

  useEffect(() => {
    axios.get('https://smartbin-backend.onrender.com/api/bin-references')
      .then((response) => {
        setBinReferences(response.data);
      })
      .catch((error) => console.error('Error fetching bin references:', error));
  }, []);

  useEffect(() => {
    if (selectedReference) {
      axios.get(`https://smartbin-backend.onrender.com/api/bin-values/${selectedReference}`)
        .then((response) => {
          setBinData(response.data);
        })
        .catch((error) => console.error('Error fetching bin data:', error));
    }
  }, [selectedReference]);

  useEffect(() => {
    if (selectedDate) {
      setFilteredData(binData.filter(item => item.timestamp.includes(selectedDate)));
    } else {
      setFilteredData(binData);
    }
  }, [selectedDate, binData]);

  // Extract data for the charts
  const timestamps = filteredData.map(item => item.timestamp);

  const getStyledSeries = (data: number[], label: string) => {
    const maxValue = Math.max(...data);
    const normalData = data.map(value => (value === maxValue ? 0 : value));
    const maxData = data.map(value => (value === maxValue ? value : 0));

    return [
      { data: normalData, label, color: 'blue' }, // Normal bars
      { data: maxData, label: 'Max Value', color: 'red' } // Red bar for max value
    ];
  };

  const uniqueDates = [...new Set(binData.map(item => item.timestamp.split('T')[0]))]; // Get unique dates from bin data

  return (
    <div>
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 }, color: 'white' }}>
        Trash Bin Statistics
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Choose Bin Reference</InputLabel>
        <Select
          value={selectedReference}
          onChange={(e) => setSelectedReference(e.target.value)}
          label="Choose Bin Reference"
        >
          {binReferences.length > 0 ? (
            binReferences.map((reference) => (
              <MenuItem key={reference} value={reference}>
                {reference}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="">No Bin References Available</MenuItem>
          )}
        </Select>
      </FormControl>

      {selectedReference && binData.length > 0 && (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Choose Date</InputLabel>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            label="Choose Date"
          >
            {uniqueDates.length > 0 ? (
              uniqueDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No Dates Available</MenuItem>
            )}
          </Select>
        </FormControl>
      )}

      {selectedReference && filteredData.length > 0 && (
        <Grid container spacing={3}>
          {/* Temperature Bar Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: '#EAEAEA', borderRadius: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom color="black">
                <img src={tempIcon} alt="Temperature Icon" style={{ width: '24px', marginRight: '8px' }} />
                Temperature Over Time
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: timestamps }]}
                series={getStyledSeries(filteredData.map(item => item.temperature), 'Temperature (°C)')}
                width={500}
                height={300}
              />
            </Box>
          </Grid>

          {/* Humidity Bar Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: '#EAEAEA', borderRadius: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom color="black">
                <img src={humidityIcon} alt="Humidity Icon" style={{ width: '24px', marginRight: '8px' }} />
                Humidity Over Time
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: timestamps }]}
                series={getStyledSeries(filteredData.map(item => item.humidity), 'Humidity (%)')}
                width={500}
                height={300}
              />
            </Box>
          </Grid>

          {/* CO2 Level Bar Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: '#EAEAEA', borderRadius: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom color="black">
                <img src={co2Icon} alt="CO2 Icon" style={{ width: '24px', marginRight: '8px' }} />
                CO2 Level Over Time
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: timestamps }]}
                series={getStyledSeries(filteredData.map(item => item.co2_level), 'CO2 Level (ppm)')}
                width={500}
                height={300}
              />
            </Box>
          </Grid>

          {/* Fill Level Bar Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: '#EAEAEA', borderRadius: 2, p: 2, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom color="black">
                <img src={fillLevelIcon} alt="Fill Level Icon" style={{ width: '24px', marginRight: '8px' }} />
                Fill Level Over Time
              </Typography>
              <BarChart
                xAxis={[{ scaleType: 'band', data: timestamps }]}
                series={getStyledSeries(filteredData.map(item => item.fill_level), 'Fill Level (%)')}
                width={500}
                height={300}
              />
            </Box>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Stats;
