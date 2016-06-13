import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import Router from '../router.js';
import { Modal, Dropdown, MenuItem } from 'react-bootstrap';
import Core from "meteor/nova:core";
const ContextPasser = Core.ContextPasser;

class UserMenu extends Component {

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

    ({UserAvatar, UserName} = Telescope.components);

    const user = this.props.user;

    return (
      <div>
        <Dropdown id="user-dropdown" className="user-menu-dropdown">
          <Dropdown.Toggle>
            <UserAvatar size="small" user={user} link={false} />
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

UserMenu.propTypes = {
  user: React.PropTypes.object
}

module.exports = UserMenu;
export default UserMenu;
