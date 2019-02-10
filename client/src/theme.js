import { createMuiTheme } from '@material-ui/core/styles';

//
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=FAFAFA&primary.text.color=000000&secondary.color=3fa296

const teal = '#3FA296';
const grey = '#FAFAFA';
const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey, light: '#FFFFFF', dark: '#C7C7C7', contrastText: '#FFFFFF',
    },
    secondary: {
      main: teal, light: '#73D4C7', dark: '#007368', contrastText: grey,
    },
    text: {
      primary: '#7E7E7E',
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'proxima-nova',
      'Arial',
      'Helvectica',
      'sans-serif',
    ].join(','),
    h3: {
      fontFamily: ['jubilat'],
      fontWeight: 600,
      color: teal,
    },
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
