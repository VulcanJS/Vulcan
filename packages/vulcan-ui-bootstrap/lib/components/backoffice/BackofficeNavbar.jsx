import React from 'react';
import { registerComponent } from 'meteor/vulcan:lib';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const BackofficeNavbar = () => ( 	
	<Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
		<Navbar.Brand href="#home">Backoffice Admin</Navbar.Brand>

		<Navbar.Toggle aria-controls="responsive-navbar-nav" />

		<Navbar.Collapse id="responsive-navbar-nav">
			<Nav className="mr-auto">
				<Nav.Link href="#home">Home</Nav.Link>
				<Nav.Link href="#features">Features</Nav.Link>
				<Nav.Link href="#pricing">Pricing</Nav.Link>
			</Nav>

			<Form inline>
				<FormControl type="text" placeholder="Search" className="mr-sm-2" />
				<Button variant="outline-info">Search</Button>
			</Form>
		</Navbar.Collapse>
	</Navbar>
)

registerComponent('BackofficeNavbar', BackofficeNavbar)
