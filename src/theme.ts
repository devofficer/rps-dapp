import { createTheme } from "@mui/material";
import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme { }
}

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
        InputLabelProps: {
          shrink: true,
        },
      },
    },
  }
});

export default theme;