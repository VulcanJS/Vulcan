import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import Navbar from 'react-bootstrap/Navbar';

const BackofficeNavbar = ({onClick}) => { 	
	return (
		<Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
			<Navbar.Toggle onClick={onClick} style={{ display: 'block', marginRight: '10px' }} />
			<Navbar.Brand href="#home">Backoffice Admin</Navbar.Brand>
		</Navbar>
	)
}

registerComponent('BackofficeNavbar', BackofficeNavbar)
