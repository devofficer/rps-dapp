import React from 'react';
import Box from '@mui/material/Box';

const AppContainer: React.FC = ({ children }) => {
  return (
    <Box width="100%" height="100vh" display="flex" flexDirection="column">
      {children}
    </Box>
  );
}

export default AppContainer;
