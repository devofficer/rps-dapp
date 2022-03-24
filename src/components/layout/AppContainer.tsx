import React from 'react';
import Box from '@mui/material/Box';

const AppContainer: React.FC = ({ children }) => {
  return (
    <Box>
      {children}
    </Box>
  );
}

export default AppContainer;
