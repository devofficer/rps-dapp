import React from 'react';
import WalletConnector from '../widgets/WalletConnector';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

const CustomAppBar: React.FC = () => {
  const isMobileView = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isMobileView ? '' : 'Rock Paper Scissors'}
        </Typography>
        <WalletConnector />
      </Toolbar>
    </AppBar>
  );
}

export default CustomAppBar;