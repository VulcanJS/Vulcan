import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from 'mdi-material-ui/Menu';
import { Link } from 'react-router-dom';

const BackofficeNavbar = ({ onClick, basePath }) => {
  // console.log('Icon render', MenuIcon); // @see https://github.com/VulcanJS/Vulcan/issues/2580
  return (
  <AppBar position="static">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={onClick}>
        <MenuIcon />
      </IconButton>

      <Link to={basePath}>
        <Typography variant="h6">Backoffice</Typography>
      </Link>
    </Toolbar>
  </AppBar>
);};

registerComponent('VulcanBackofficeNavbar', BackofficeNavbar);
