import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/std:accounts-ui';
import Router from '../router.js';
import { Modal, Dropdown, MenuItem } from 'react-bootstrap';
import Core from "meteor/nova:core";
const ContextPasser = Core.ContextPasser;

class UsersMenu extends Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalOpen: {
        settings: false,
        feeds: false
      }
    };
  }

  openModal(modal) {
    return (event) => {
      const modalOpen = {};
      modalOpen[modal] = true;
      this.setState({ modalOpen });
    };
  }

  closeModal(modal) {
    return (event) => {
      const modalOpen = {};
      modalOpen[modal] = false;
      this.setState({ modalOpen });
    };
  }

  renderSettingsModal() {
    
    const SettingsEditForm = Telescope.components.SettingsEditForm;

    return (
      <Modal show={this.state.modalOpen.settings} onHide={this.closeModal('settings')}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Settings</Modal.Title>
        </Modal.Header>        
        <Modal.Body>
          <ContextPasser currentUser={this.props.user} closeCallback={this.closeModal('settings')}>
            <SettingsEditForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  renderFeedsModal() {

    const FeedsEditForm = Telescope.components.FeedsEditForm;

    return (
      <Modal bsSize='large' show={this.state.modalOpen.feeds} onHide={this.closeModal('feeds')}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feeds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContextPasser currentUser={this.props.user} closeCallback={this.closeModal('feeds')}>
            <FeedsEditForm/>
          </ContextPasser>
        </Modal.Body>
      </Modal>
    )
  }

  render() {

    ({UsersAvatar, UsersName} = Telescope.components);

    const user = this.props.user;

    return (
      <div className="users-menu">
        <Dropdown id="user-dropdown">
          <Dropdown.Toggle>
            <UsersAvatar size="small" user={user} link={false} />
            <div>{Users.getDisplayName(user)}</div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem className="dropdown-item" eventKey="1" href={Router.path("users.single", {slug: user.telescope.slug})}>Profile</MenuItem>
            <MenuItem className="dropdown-item" eventKey="2" href={Router.path("account")}>Edit Account</MenuItem>
            {Users.is.admin(user) ? <MenuItem className="dropdown-item" eventKey="3" onClick={this.openModal('settings')}>Settings</MenuItem> : null}
            {Users.is.admin(user) ? <MenuItem className="dropdown-item" eventKey="4" onClick={this.openModal('feeds')}>Imported Feeds</MenuItem> : null}
            <MenuItem className="dropdown-item" eventKey="5" onClick={() => Meteor.logout(Accounts.ui._options.onSignedOutHook())}>Log Out</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
        {this.renderSettingsModal()}
        {this.renderFeedsModal()}
      </div>
    ) 
  }

}

UsersMenu.propTypes = {
  user: React.PropTypes.object
}

module.exports = UsersMenu;
export default UsersMenu;