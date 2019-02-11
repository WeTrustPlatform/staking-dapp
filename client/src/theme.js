import { createMuiTheme } from '@material-ui/core/styles';

//
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=FAFAFA&primary.text.color=000000&secondary.color=3fa296

const teal = '#3FA296';
const grey = '#FAFAFA';
const brownGrey = '#7E7E7E';
const greyBlue = '#67C6BB';
const white = '#FFFFFF';

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
      main: grey, light: white, dark: '#C7C7C7', contrastText: white,
    },
    secondary: {
      main: teal, light: greyBlue, dark: '#007368', contrastText: grey,
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
        fontWeight: 'bold',
        fontSize: '1.25rem',
      },
      shrink: {
        transform: 'translate(0, -1rem)',
      },
    },
    MuiInputBase: {
      root: {
        paddingLeft: '1rem',
        fontSize: '1.25rem',
        border: '1px solid #CCCCCC',
        borderRadius: 3,
      },
      fullWidth: {
        width: 'auto',
      },
      focused: {
        borderColor: greyBlue,
      },
    },
    MuiMenuItem: {
      root: {
        borderColor: greyBlue,
      },
      selected: {
        color: white,
        backgroundColor: teal,
      },
    },
    MuiPaper: {
      // same key as the prop elevation={3} in search input
      elevation3: {
        boxShadow: undefined,
        border: `1px solid ${greyBlue}`,
        borderRadius: 3,
      },
    },
  },
});

export default theme;
