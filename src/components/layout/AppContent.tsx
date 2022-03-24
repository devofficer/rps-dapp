import React from 'react';
import Box from '@mui/material/Box';

const AppContent: React.FC = ({ children }) => {
  return (
    <Box 
      width="100%" 
      flexGrow={1} 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      flexDirection="column"
    >
      {children}
    </Box>
  );
}

export default AppContent;
