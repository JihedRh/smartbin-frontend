import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import GaugeChart from 'react-gauge-chart';


import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';


import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import TrashBinTable from './TrashBinTable';
import ControlledCarousel from './ControlledCarousel';
import PieActiveArc from './PieActiveArc';
import PieActiveBin from './PieActiveBin';




// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [userCount, setUserCount] = useState(null); 
  const [binCount, setBinCount] = useState<number | null>(null);  
  const [okBins, setOkBins] = useState<number | null>(null);
  const [noOkBins, setNoOkBins] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [Humidty, setHumidty] = useState<number | null>(null);
  const [FillLevel, setFillLevel] = useState<number | null>(null);
  const [Co2Level, setCo2Level] = useState<number | null>(null);




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
  
  return (
    <DashboardContent maxWidth="xl" sx={{
      backgroundImage: 'url(/assets/bg_dashboard.jpg)',
      backgroundSize: 'cover', 
      backgroundPosition: 'center',  
      backgroundRepeat: 'no-repeat',
    
    }}>
    
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } , color: 'white' }}>
        Hi, Welcome back 👋
      </Typography>
      <Grid xs={12} sm={6} md={3}>
        <Grid/>

</Grid>
<Grid xs={12} md={6} lg={12} sx={{ mb: 3 }}>
<ControlledCarousel />
</Grid>

<Grid container spacing={3}>
        {/* Weekly Sales - Now showing bin count */}
 
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Smart Bins"
            percent={-0.1}
            total={binCount !== null ? binCount : 0}  
            icon={<img alt="icon" src="/assets/icons/glass/garbage-bin-trash-bin-svgrepo-com.svg" />}  
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12], 
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="All users"
            percent={-0.1}
            total={userCount !== null ? userCount : 0}  
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Good Bins"
            percent={2.8}
            total={okBins !== null ? okBins : 0}  
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/garbage-bin-trash-bin-svgrepo-com.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Stoped Bins"
            percent={3.6}
            total={noOkBins !== null ? noOkBins : 0}  
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/stop-svgrepo-com.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>
   <Grid container spacing={3}>

  <Grid  xs={12} md={6} lg={6}>
    <PieActiveArc />
</Grid>
<Grid  xs={12} md={6} lg={6}>
    <PieActiveBin />
</Grid>
</Grid>
        
        
<Grid xs={12} md={6} lg={12} sx={{ width: '100%' }}>
  <TrashBinTable />
</Grid>

      </Grid>
    </DashboardContent>
  );
}
