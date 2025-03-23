import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Stats from './Stats';
import SmartTrashBinTable from '../SmartTrashBinTable';

const TabComponent: React.FC = () => {
  const [value, setValue] = useState<string>('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="Tab menu">
            <Tab label="Bin Statistics" value="1" />
            <Tab label="Bin Tables" value="2" />
          </TabList>
        </Box>

        {/* Dynamically load pages/components for each tab */}
        <TabPanel value="1">
          <Stats /> {/* Content for Bin Statistics */}
        </TabPanel>
        <TabPanel value="2">
          <SmartTrashBinTable /> {/* Content for Bin Tables */}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TabComponent;
