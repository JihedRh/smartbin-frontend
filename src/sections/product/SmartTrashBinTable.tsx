import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  CircularProgress, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  SelectChangeEvent 
} from '@mui/material';

interface BinData {
  reference: string;
  fill_level: number;
  co2_level: number;
  temperature: number;
  humidity: number;
  statut: string;
  functionality: string;
  type: number; 
}

const SmartTrashBinTable: React.FC = () => {
  const [binData, setBinData] = useState<BinData[]>([]); 
  const [filteredData, setFilteredData] = useState<BinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [binType, setBinType] = useState<number>(0); 

  useEffect(() => {
    axios.get('https://smartbin-backend.onrender.com/api/smart-trash-bins')
      .then((response) => {
        setBinData(response.data);
        setFilteredData(response.data); // Set filtered data to all initially
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching smart trash bins data:', error);
        setLoading(false);
      });
  }, []);

  const handleTypeChange = (event: SelectChangeEvent<number>) => {
    const selectedType = Number(event.target.value); // Convert to number
    setBinType(selectedType);
  
    if (selectedType === 0) {
      setFilteredData(binData); // Show all data
    } else {
      setFilteredData(binData.filter((bin) => bin.type === selectedType)); // Filter by selected type
    }
  };
  

  const getInterventionStatus = (functionality: string, statut: string): string => {
    if (functionality === 'OK' && statut === 'empty') {
      return 'No Intervention';
    }
    if (functionality === 'OK' && statut === 'almost full') {
      return 'Bin Almost Full';
    }
    if (functionality !== 'OK' && statut === 'full') {
      return 'Intervention Needed';
    }
    if (functionality !== 'OK' && statut === 'empty') {
      return 'Intervention Needed';
    }
    return 'No Intervention'; 
  };

  const getInterventionColor = (functionality: string, statut: string): string => {
    if (functionality === 'OK' && statut === 'empty') {
      return 'green';
    }
    if (functionality === 'OK' && statut === 'almost full') {
      return 'yellow';
    }
    if (functionality !== 'OK' && statut === 'full') {
      return 'red';
    }
    if (functionality !== 'OK' && statut === 'empty') {
      return 'red';
    }
    return 'green'; 
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' , color: '#1F79D9'}}>
        Smart Trash Bins Data
      </Typography>

      {/* ComboBox for selecting bin type */}
      <FormControl sx={{ mb: 3 }}>
        <InputLabel>Bin Type</InputLabel>
        <Select
          value={binType}
          onChange={handleTypeChange}
          label="Bin Type"
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Operation Room Bins</MenuItem>
          <MenuItem value={2}>Hall Bins</MenuItem>
        </Select>
      </FormControl>

      {/* Display loading spinner while data is being fetched */}
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 400, 
            overflowY: 'auto', 
            borderRadius: '8px', 
            marginBottom: '20px'
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="smart-trash-bin-table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reference</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Intervention</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Fill Level (%)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>CO2 Level (ppm)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Temperature (°C)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Humidity (%)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Functionality</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.reference}>
                  <TableCell align="center">{row.reference}</TableCell>

                  {/* Intervention Column */}
                  <TableCell 
                    align="center" 
                    sx={{
                      fontWeight: 'bold', 
                      backgroundColor: getInterventionColor(row.functionality, row.statut),
                      color: 'white',
                      padding: '10px'
                    }}
                  >
                    {getInterventionStatus(row.functionality, row.statut)}
                  </TableCell>

                  <TableCell align="center">{row.fill_level}</TableCell>
                  <TableCell align="center">{row.co2_level}</TableCell>
                  <TableCell align="center">{row.temperature}</TableCell>
                  <TableCell align="center">{row.humidity}</TableCell>
                  <TableCell align="center">{row.statut}</TableCell>
                  <TableCell 
                    align="center" 
                    sx={{
                      fontWeight: 'bold', 
                    }}
                  >
                    {row.functionality}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default SmartTrashBinTable;
