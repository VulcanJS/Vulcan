import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCurrentUser, Components, replaceComponent } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import { Link } from 'react-router';
import NoSSR from 'react-no-ssr';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const drawerStyle = {
  backgroundColor: "none",
  boxShadow: "none",
  top: "80px",
  width: "150px",
  position: "absolute",
}

const appBarStyle = {
  boxShadow: "none",
}

const appBarTitleStyle = {
  paddingTop: '2px',
  fontSize: '19px',
  cursor: 'pointer',
  flex: 'none',
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNavigation: false,
    };
  }

  toggleNavigation = (event) => {
    event.preventDefault();
    this.setState({showNavigation: !this.state.showNavigation});
  }

  closeNavigation = (event) => {
    event.preventDefault();
    this.setState({showNavigation: false});
  }

  renderAppBarElementRight = () => <div>
    <NoSSR><Components.SearchBar /></NoSSR>
    {this.props.currentUser ? <Components.UsersMenu /> : <Components.UsersAccountMenu />}
  </div>

  render() {
    let { router, currentUser } = this.props;
    return (
      <div className="header-wrapper">
        <header className="header">
          <AppBar
            title="LESSWRONG"
            onLeftIconButtonTouchTap={this.toggleNavigation}
            onTitleTouchTap={() => router.push("/")}
            iconElementRight = {this.renderAppBarElementRight()}
            style={appBarStyle}
            titleStyle={appBarTitleStyle}
          />
        <Drawer open={this.state.showNavigation} containerStyle={drawerStyle} >
          <MenuItem containerElement={<Link to={"/"}/>}> HOME </MenuItem>
          <MenuItem containerElement={<Link to={"/sequences"}/>}> SEQUENCES </MenuItem>
          <MenuItem containerElement={<Link to={"/codex"}/>}> CODEX </MenuItem>
          <MenuItem containerElement={<Link to={"/hpmor"}/>}> HPMOR </MenuItem>
          <MenuItem containerElement={<Link to={"/library"}/>}> THE LIBRARY </MenuItem>
        </Drawer>
        </header>
      </div>
    )
  }

}

Header.displayName = "Header";

Header.propTypes = {
  currentUser: PropTypes.object,
};

replaceComponent('Header', Header, withCurrentUser, withRouter);
