import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const BackofficeNavbar = ({ onClick, basePath }) => {
  // console.log('Icon render', MenuIcon); // @see https://github.com/VulcanJS/Vulcan/issues/2580
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onClick} size="large">
          <MenuIcon />
        </IconButton>

        <Link to={basePath}>
          <Typography variant="h6">Backoffice</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

registerComponent('VulcanBackofficeNavbar', BackofficeNavbar);
