import React from 'react';
import WalletConnector from '../widgets/WalletConnector';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const CustomAppBar: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rock Paper Scissors
          </Typography>
          <WalletConnector />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default CustomAppBar;