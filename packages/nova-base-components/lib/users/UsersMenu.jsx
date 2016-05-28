import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import Router from '../router.js';
import { Modal, Dropdown, MenuItem } from 'react-bootstrap';
import { ContextPasser } from "meteor/nova:core";

class UsersMenu extends Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {modalOpen: false};
  }

  openModal() {
    this.setState({modalOpen: true});
  }

  closeModal() {
    this.setState({modalOpen: false});
  }

  renderSettingsModal() {
    
    const SettingsEditForm = Telescope.components.SettingsEditForm;

    return (
      <Modal show={this.state.modalOpen} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Settings</Modal.Title>
        </Modal.Header>        
        <Modal.Body>
          <ContextPasser currentUser={this.props.user} closeCallback={this.closeModal}>
            <SettingsEditForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  render() {

    const user = this.props.user;

    return (
      <div className="users-menu">
        <Dropdown id="user-dropdown">
          <Dropdown.Toggle>
            <Telescope.components.UsersAvatar size="small" user={user} link={false} />
            <div>{Users.getDisplayName(user)}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem className="dropdown-item" eventKey="1" href={Router.path("users.single", {slug: user.telescope.slug})}>Profile</MenuItem>
            <MenuItem className="dropdown-item" eventKey="2" href={Router.path("account")}>Edit Account</MenuItem>
            {Users.is.admin(user) ? <MenuItem className="dropdown-item" eventKey="3" onClick={this.openModal}>Settings</MenuItem> : null}
            <MenuItem className="dropdown-item" eventKey="4" onClick={() => Meteor.logout(Accounts.ui._options.onSignedOutHook())}>Log Out</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        {this.renderSettingsModal()}
      </div>
    ) 
  }

}

UsersMenu.propTypes = {
  user: React.PropTypes.object
}

module.exports = UsersMenu;
export default UsersMenu;