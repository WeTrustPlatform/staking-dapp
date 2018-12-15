import { createMuiTheme } from '@material-ui/core/styles';

// https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=4DB6AC&secondary.text.color=FAFAFA&primary.color=F5F5F5&primary.text.color=26A69A
//
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F5F5F5', light: '#FFFFFF', dark: '#C1C1C1', contrastText: '#26A69A',
    },
    secondary: {
      main: '#4DB6AC', light: '#82E9DE', dark: '#00867D', contrastText: '#FAFAFA',
    },
    text: {
      primary: '#616161',
    },
  },
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#F6A623',
        color: '#FAFAFA',
      },
    },
    MuiTableCell: {
      head: {
        fontSize: '1rem',
        fontWeight: 'bold',
      },
      body: {
        fontSize: '1rem',
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: '1.125rem',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '1.25rem',
      },
    },
  },
});

export default theme;
