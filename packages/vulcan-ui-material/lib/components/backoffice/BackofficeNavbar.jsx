import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const BackofficeNavbar = ({onClick}) => (
	<AppBar position="static">
		<Toolbar>

			<IconButton
				edge="start"
				color="inherit"
				aria-label="menu"
				onClick={onClick}
			>
				<MenuIcon />
			</IconButton>

			<Typography variant="h6">
				Backoffice
			</Typography>
		</Toolbar>
	</AppBar>
)

registerComponent('BackofficeNavbar', BackofficeNavbar)
