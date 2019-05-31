import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from 'mdi-material-ui/Menu';
import ChevronLeftIcon from 'mdi-material-ui/ChevronLeft';
import withStyles from '@material-ui/core/styles/withStyles';
import { getSetting, registerComponent } from 'meteor/vulcan:core';
import classNames from 'classnames';


const drawerWidth = 240;
const topBarHeight = 100;


const styles = theme => ({
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    height: `${topBarHeight}px`,
    minHeight: `${topBarHeight}px`,
  },
  headerMid: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    '& h1': {
      margin: '0 24px 0 0',
      fontSize: '18px',
      lineHeight: 1,
    }
  },
  menuButton: {
    marginRight: theme.spacing.unit * 3,
  },
});


const Header = (props, context) => {
  const classes = props.classes;
  const isSideNavOpen = props.isSideNavOpen;
  const toggleSideNav = props.toggleSideNav;
  
  const siteTitle = getSetting('title', 'My App');
  
  return (
    <AppBar className={classNames(classes.appBar, isSideNavOpen && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        
        <IconButton
          aria-label="open drawer"
          onClick={e => toggleSideNav()}
          className={classNames(classes.menuButton)}
          color="inherit"
        >
          {isSideNavOpen ? <ChevronLeftIcon/> : <MenuIcon/>}
        </IconButton>
        
        <div className={classNames(classes.headerMid)}>
          
            <Typography variant="h6" color="inherit" className="tagline">
              {siteTitle}
            </Typography>

        </div>
        
      </Toolbar>
    </AppBar>
  );
};


Header.propTypes = {
  classes: PropTypes.object.isRequired,
  isSideNavOpen: PropTypes.bool,
  toggleSideNav: PropTypes.func,
};


Header.displayName = 'Header';


registerComponent('Header', Header, [withStyles, styles]);
