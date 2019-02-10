import { createMuiTheme } from '@material-ui/core/styles';

//
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=FAFAFA&primary.text.color=000000&secondary.color=3fa296

const teal = '#3FA296';
const grey = '#FAFAFA';
const brownGrey = '#7E7E7E';

const proximaNova = [
  'proxima-nova',
  'Arial',
  'Helvectica',
  'sans-serif',
].join(',');
const jubilat = [
  'jubilat',
  'Arial',
  'Helvectica',
  'serif',
].join(',');

const titleFont = {
  fontFamily: jubilat,
  fontWeight: 600,
};
const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey, light: '#FFFFFF', dark: '#C7C7C7', contrastText: '#FFFFFF',
    },
    secondary: {
      main: teal, light: '#73D4C7', dark: '#007368', contrastText: grey,
    },
    text: {
      primary: brownGrey,
      secondary: teal,
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: proximaNova,
    h4: titleFont,
    h3: titleFont,
    h5: titleFont,
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 4,
      },
      contained: {
        fontSize: '1rem',
        fontWeight: 'bold',
        height: '3rem',
        color: grey,
      },
      containedPrimary: {
        backgroundColor: '#F3B058',
      },
    },
    MuiTableCell: {
      head: {
        fontSize: '1.25rem',
        fontFamily: jubilat,
        fontWeight: 'bold',
      },
      body: {
        fontSize: '1.125rem',
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
