import { createMuiTheme } from '@material-ui/core/styles';

//
// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=FAFAFA&primary.text.color=000000&secondary.color=3fa296

const teal = '#3FA296';
const grey = '#FAFAFA';
const darkGrey = '#D8D8D8';
const brownGrey = '#7E7E7E';
const greyBlue = '#67C6BB';
const white = '#FFFFFF';

const proximaNova = ['proxima-nova', 'Arial', 'Helvectica', 'sans-serif'].join(
  ',',
);
const jubilat = ['jubilat', 'Arial', 'Helvectica', 'serif'].join(',');

const titleFont = {
  fontFamily: jubilat,
  fontWeight: 600,
};

const fontSize = 16;
const borderLine = `1px solid ${darkGrey}`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey,
      light: white,
      dark: darkGrey,
      contrastText: white,
    },
    secondary: {
      main: teal,
      light: greyBlue,
      dark: '#007368',
      contrastText: grey,
    },
    text: {
      primary: brownGrey,
      secondary: teal,
      fontSize,
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: proximaNova,
    fontSize,
    h3: titleFont,
    h4: {
      fontSize: 36,
      lineHeight: '32px',
      ...titleFont,
    },
    h5: {
      fontSize: 24,
      lineHeight: '32px',
      fontStyle: 'normal',
      ...titleFont,
    },
    h6: {
      fontSize: 18,
      lineHeight: '24px',
      fontWeight: 400,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 4,
      },
      sizeLarge: {
        fontSize,
        fontWeight: 'bold',
        height: '3rem',
        color: grey,
      },
      containedPrimary: {
        backgroundColor: '#F3B058',
      },
    },
    MuiTableCell: {
      root: {
        border: borderLine,
      },
      head: {
        fontSize: '1.125rem',
        fontFamily: jubilat,
        fontWeight: 600,
        backgroundColor: grey,
      },
    },
    MuiTable: {
      root: {
        borderStyle: 'hidden',
      },
    },
    MuiInputLabel: {
      root: {
        fontWeight: 'bold',
        fontSize,
      },
      shrink: {
        transform: 'translate(0, -1rem)',
      },
    },
    MuiInputBase: {
      root: {
        paddingLeft: '1rem',
        height: '3.25rem',
        fontSize,
        border: '1px solid #CCCCCC',
        borderRadius: 3,
        backgroundColor: white,
      },
      fullWidth: {
        width: 'auto',
      },
      focused: {
        borderColor: greyBlue,
      },
    },
    MuiListItem: {
      selected: {
        // the framework selector is more specific than a single
        // MuiListItem-selected
        color: `${white} !important`,
        backgroundColor: `${greyBlue} !important`,
      },
    },
    MuiListItemText: {
      primary: {
        fontSize,
      },
    },
    MuiMenuItem: {
      root: {
        borderColor: greyBlue,
      },
    },
    MuiPaper: {
      // same key as the prop elevation={3} in search input
      elevation3: {
        boxShadow: undefined,
        border: `1px solid ${greyBlue}`,
        borderRadius: 3,
      },
      elevation2: {
        boxShadow: undefined,
        border: borderLine,
        borderRadius: 3,
      },
    },
  },
});

export default theme;
