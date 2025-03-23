import React, { useState, useCallback, useEffect } from 'react';
import { Box, Grid, Typography, Autocomplete, TextField, InputAdornment } from '@mui/material';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';
import LiquidFillGauge from "react-liquid-gauge";

import { DashboardContent } from 'src/layouts/dashboard';
import { ProductSort } from '../product-sort';
import { ProductFilters } from '../product-filters';
import type { FiltersProps } from '../product-filters';
import tempIcon from '../../../../public/assets/icons8-temperature-64.png';
import co2Icon from '../../../../public/assets/icons8-co2-96.png';
import fillLevelIcon from '../../../../public/assets/icons8-volume-level-96.png';
import humidityIcon from '../../../../public/assets/icons8-humidity-64.png';
import TabComponent from './TabComponenet';



const defaultFilters = {
  price: '',
  gender: ['men'],
  colors: ['#FF4842'],
  rating: 'up4Star',
  category: 'all',
};

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => setOpenFilter(true), []);
  const handleCloseFilter = useCallback(() => setOpenFilter(false), []);
  const handleSort = useCallback((newSort: string) => setSortBy(newSort), []);
  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);
  const [userCount, setUserCount] = useState(null); 
  const [binCount, setBinCount] = useState<number | null>(null);  
  const [okBins, setOkBins] = useState<number | null>(null);
  const [noOkBins, setNoOkBins] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [Humidty, setHumidty] = useState<number | null>(null);
  const [FillLevel, setFillLevel] = useState<number | null>(null);
  const [Co2Level, setCo2Level] = useState<number | null>(null);

  const tabLabels = ['Item One', 'Item Two', 'Item Three'];
  const tabContents = [
    <div>Content for Item One</div>,
    <div>Content for Item Two</div>,
    <div>Content for Item Three</div>
  ];



  const [binReferences, setBinReferences] = useState([]);
  const [selectedBin, setSelectedBin] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCount = () => {
      axios.get('https://smartbin-backend.onrender.com/api/user-count')
        .then(response => {
          setUserCount(response.data.count);
        })
        .catch(error => {
          console.error('Error fetching user count:', error);
        });
    };
  
    fetchUserCount();
  
    const interval = setInterval(fetchUserCount, 1000);
  
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchBinCount = () => {
      axios.get('https://smartbin-backend.onrender.com/api/bin-count')  
        .then(response => {
          setBinCount(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bin count:', error);
        });
    };

    fetchBinCount();

    const interval = setInterval(fetchBinCount, 1000);  

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchOkBins = () => {
      axios.get('https://smartbin-backend.onrender.com/api/smart-bins/ok')
        .then(response => {
          setOkBins(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bins with functionality ok:', error);
        });
    };


  
    const interval = setInterval(fetchOkBins, 1000);  
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedBin) {
      interval = setInterval(() => {
        axios.get(`https://smartbin-backend.onrender.com/api/bins/temperature/${selectedBin}`)
          .then(response => {
            console.log('Temperature Response:', response.data); 
            localStorage.setItem('selected_bin', selectedBin);
            setTemperature(response.data.temperature);
          })
          .catch(error => {
            console.error('Error fetching temperature:', error);
          });
      }, 1000); 
    } else {
      setTemperature(null);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [selectedBin]);
  
  useEffect(() => {
    let interval : NodeJS.Timeout;
    if (selectedBin) {
      interval = setInterval(() => {
        axios.get(`https://smartbin-backend.onrender.com/api/bins/humidity/${selectedBin}`)
          .then(response => {
            console.log('humidity Response:', response.data); 
            setHumidty(response.data.humidity);
          })
          .catch(error => {
            console.error('Error fetching humidity:', error);
          });
      }, 1000);
    } else {
      setHumidty(null);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [selectedBin]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedBin) {
      interval = setInterval(() => {
        axios.get(`https://smartbin-backend.onrender.com/api/bins/co2/${selectedBin}`)
          .then(response => {
            console.log('co2 Response:', response.data); 
            setCo2Level(response.data.co2_level);
          })
          .catch(error => {
            console.error('Error fetching co2:', error);
          });
      }, 1000); 
    } else {
      setCo2Level(null);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [selectedBin]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedBin) {
      interval = setInterval(() => {
        axios.get(`https://smartbin-backend.onrender.com/api/bins/fill/${selectedBin}`)
          .then(response => {
            console.log('fill Response:', response.data); 
            setFillLevel(response.data.fill_level);
          })
          .catch(error => {
            console.error('Error fetching fill:', error);
          });
      }, 1000);
    } else {
      setFillLevel(null);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [selectedBin]);
  
  useEffect(() => {
    const fetchNoOkBins = () => {
      axios.get('https://smartbin-backend.onrender.com/api/smart-bins/no-ok')
        .then(response => {
          setNoOkBins(response.data.count);  
        })
        .catch(error => {
          console.error('Error fetching bins with functionality no ok:', error);
        });
    };
  
    fetchNoOkBins();
  
    const interval = setInterval(fetchNoOkBins, 1000); 
  
    return () => clearInterval(interval);
  }, []);
  
  
  useEffect(() => {
    axios.get('https://smartbin-backend.onrender.com/api/bin-references')
      .then(response => {
        setBinReferences(response.data);
      })
      .catch(error => {
        console.error('Error fetching bin references:', error);
      });
  }, []);

  const barData = [
    { label: 'Men', value: 400 },
    { label: 'Women', value: 300 },
    { label: 'Kids', value: 200 },
  ];

  const pieData = [
    { id: 0, value: 30, label: 'Shoes' },
    { id: 1, value: 40, label: 'Apparel' },
    { id: 2, value: 30, label: 'Accessories' },
  ];

  const lineData = [
    { month: 'Jan', sales: 100 },
    { month: 'Feb', sales: 200 },
    { month: 'Mar', sales: 150 },
    { month: 'Apr', sales: 250 },
  ];

  return (
    <DashboardContent maxWidth="xl" sx={{
      backgroundImage: 'url(/assets/bg_dashboard.jpg)',
      backgroundSize: 'cover', 
      backgroundPosition: 'center',  
      backgroundRepeat: 'no-repeat',
    
    }}>
      <Typography variant="h4" color="white" sx={{ mb: 3 }}>
        Smart Trash Bin Overview
      </Typography>
      <Autocomplete
  disablePortal
  options={binReferences}
  value={selectedBin}
  onChange={(event, newValue) => setSelectedBin(newValue)}
  sx={{
    width: 350,
    mb: 3,
    '& .MuiInputBase-root': {
      borderRadius: '12px', 
      backgroundColor: '#f9f9f9', 
      '&:hover': {
        backgroundColor: '#f1f1f1', 
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ccc', 
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#007bff', 
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#007bff', 
      boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
    },
    '& .MuiInputLabel-root': {
      fontSize: '1rem', 
      color: '#333', 
    },
    '& .MuiAutocomplete-popupIndicator': {
      color: '#007bff', 
    },
  }}
  renderInput={(params) => (
    <TextField
  {...params}
  label="Select Bin"
  variant="outlined"
  InputLabelProps={{
    sx: {
      color: 'white', 
    },
  }}
  InputProps={{
    ...params.InputProps,
    startAdornment: (
      <InputAdornment position="start">
        {/* You can keep the Search icon here or remove it if you prefer */}
      </InputAdornment>
    ),
  }}
/>

  )}
/>
<Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } , color: 'white' }}>
        Trash Bin Sensor Values 
      </Typography>
      <Grid container spacing={3} justifyContent="center">
      {/* Gauge 1 */}
      <Grid item xs={12} md={3}>
        <div style={{ textAlign: 'center', backgroundColor: '#EAEAEA', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: '#1F79D9' }}>
            <img src={tempIcon} alt="Temperature" style={{ width: '40px', marginRight: '8px' }} />
            
          </h3>
          <GaugeChart
            id="judge-gauge-1"
            nrOfLevels={20}
            percent={Math.min((temperature ?? 0) / 100, 1)}
            colors={['#1F79D9', '#FFC371', '#00C851']}
            arcWidth={0.3}
            textColor="#1F79D9"
            style={{
              width: '100%',
              maxWidth: '300px',
              margin: '20px auto',
              borderRadius: '8px',
            }}
            formatTextValue={() => `${temperature} °C`}
            animate
          />
        </div>
      </Grid>

      {/* Gauge 2 */}
      <Grid item xs={12} md={3}>
        <div style={{ textAlign: 'center', backgroundColor: '#EAEAEA', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#1F79D9' }}>
            <img src={co2Icon} alt="Temperature" style={{ width: '40px', marginRight: '8px' }} />
            
          </h3>
          <GaugeChart
            id="judge-gauge-2"
            nrOfLevels={20}
            percent={Math.min((Co2Level ?? 0) / 100, 1)}
            colors={['#1F79D9', '#FFC371', '#00C851']}
            arcWidth={0.3}
            textColor="#1F79D9"
            style={{
              width: '100%',
              maxWidth: '300px',
              margin: '20px auto',
              borderRadius: '8px',
            }}
            formatTextValue={() => `${Co2Level} ppm`}
            animate
          />
        </div>
      </Grid>

      {/* Gauge 3 */}
      <Grid item xs={12} md={3}>
  <div
    style={{
      textAlign: "center",
      backgroundColor: "#EAEAEA",
      padding: "20px", // Padding for spacing
      borderRadius: "10px", // Rounded corners for design
    }}
  >
    <h3 style={{ color: "#1F79D9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src={fillLevelIcon}
        alt="Fill Level"
        style={{ width: "35px", marginRight: "8px" }} // Slightly bigger icon size
      />
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1F79D9" }}>
        {`${FillLevel}%`}
      </span>
    </h3>
    <LiquidFillGauge
      style={{ margin: "0 auto" }}
      width={140}  // Slightly larger width
      height={133}  // Slightly larger height
      value={FillLevel ?? 0}
      percent="%"
      textSize={0} // Hide text inside the gauge
      riseAnimation
      waveAnimation
      waveFrequency={2}
      waveAmplitude={3}
      gradient
      gradientStops={[
        { key: "0%", stopColor: "#1F79D9" },
        { key: "100%", stopColor: "#004a8d" }
      ]}
      circleStyle={{
        fill: "#EAEAEA",
      }}
      waveStyle={{
        fill: "#1F79D9",
      }}
    />
  </div>
</Grid>



      {/* Gauge 4 */}
      <Grid item xs={12} md={3}>
        <div style={{ textAlign: 'center', backgroundColor: '#EAEAEA', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#1F79D9' }}>
            <img src={humidityIcon} alt="Temperature" style={{ width: '40px', marginRight: '8px' }} />
            
          </h3>
          <GaugeChart
            id="judge-gauge-4"
            nrOfLevels={20}
            percent={Math.min((Humidty ?? 0) / 100, 1)}
            colors={['#1F79D9', '#FFC371', '#00C851']}
            arcWidth={0.3}
            textColor="#1F79D9"
            style={{
              width: '100%',
              maxWidth: '300px',
              margin: '20px auto',
              borderRadius: '8px',
            }}
            formatTextValue={() => `${Humidty}%`}
            animate
          />
        </div>
      </Grid>
    </Grid>
    <Grid xs={12} md={6} lg={12} sx={{ width: '100%' }}>
    <TabComponent />
    </Grid>
    </DashboardContent>
  );
}

