import { registerTheme } from './themes';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import error from '@material-ui/core/colors/red';
import success from '@material-ui/core/colors/green';


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
    primary: indigo,
    secondary: blue,
    error: error,
  },
  
  utils: {
    
    tooltipEnterDelay: 700,
  
    errorMessage: {
      textAlign: 'center',
      backgroundColor: error[500],
      color: '#fff',
      borderRadius: 4,
      padding: '6px 16px',
      '&.success': {
        backgroundColor: success[500],
      }
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
    
  },
  
};


registerTheme('Sample', theme);
