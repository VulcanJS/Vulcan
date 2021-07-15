import { registerTheme } from './themes';
import { indigo as primary } from '@material-ui/core/colors';
import { deepPurple as secondary } from '@material-ui/core/colors';
import { red as error } from '@material-ui/core/colors';
import { blue as info } from '@material-ui/core/colors';
import { green as success } from '@material-ui/core/colors';
import { orange as warning } from '@material-ui/core/colors';


/** @ignore */

/**
 *
 * Sample theme to get you out of the gate quickly
 *
 * For a complete list of configuration variables see:
 * https://material-ui.com/customization/themes/
 *
 */


const theme = {

  palette: {

    primary: {
      light: primary[200],
      main: primary[500],
      dark: primary[800],
      contrastText: '#fff',
      ...primary
    },

    secondary: {
      light: secondary[200],
      main: secondary[500],
      dark: secondary[800],
      contrastText: '#fff',
      ...secondary
    },

    error: {
      light: error[200],
      main: error[500],
      dark: error[800],
      contrastText: '#fff',
      ...error
    },

    warning: {
      light: warning[100],
      main: warning[500],
      dark: warning[900],
      contrastText: '#fff',
      ...warning
    },

    success: {
      light: success[100],
      main: success[500],
      dark: success[900],
      contrastText: '#fff',
      ...success
    },

    info: {
      light: info[100],
      main: info[500],
      dark: info[900],
      contrastText: '#fff',
      ...info
    },

  },

  utils: {

    tooltipEnterDelay: 700,

    errorMessage: {
      textAlign: 'center',
      backgroundColor: error[500],
      color: 'white',
      borderRadius: '4px',
      fontWeight: 'bold',
    },

    denseTable: {
      '& > thead > tr > th, & > tbody > tr > td': {
        padding: '4px 16px 4px 16px',
      },
      '& > thead > tr > th:last-child, & > tbody > tr > td:last-child': {
        paddingRight: '16px',
      },
    },

    flatTable: {
      '& > thead > tr > th, & > tbody > tr > td': {
        padding: '4px 16px 4px 16px',
        whiteSpace: 'nowrap',
      },
      '& > thead > tr > th:last-child, & > tbody > tr > td:last-child': {
        paddingRight: '16px',
      },
    },

    denserTable: {
      '& > thead > tr, & > tbody > tr': {
        height: '40px',
      },
      '& > thead > tr > th, & > tbody > tr > td': {
        padding: '4px 16px 4px 16px',
        whiteSpace: 'nowrap',
      },
      '& > thead > tr > th:last-child, & > tbody > tr > td:last-child': {
        paddingRight: '16px',
      },
    },

    testPaper: {
      backgroundColor: warning[50],
    },

    closeButton: {
      display: 'block !important',
      position: 'absolute',
      right: 8,
      top: 8,
    },

  },

  overrides: {
    MuiButton: {
      root: {
        lineHeight: 1,
        padding: '4px 16px',
        minHeight: 40,
      },
      text: {
        padding: '4px 16px',
      },
      outlined: {
        padding: '4px 16px',
      },
      sizeSmall: {
        padding: '4px 8px',
        minHeight: 32,
      },
      sizeLarge: {
        padding: '4px 24px',
        minHeight: 48,
      },
      label: {
        flexDirection: 'inherit',
        '& > svg': {
          marginRight: '8px',
        },
        '& > span.icon-wrap': {
          marginRight: '8px',
          fontSize: 0,
        },
      },
    },
  },

};


registerTheme('Sample', theme);
