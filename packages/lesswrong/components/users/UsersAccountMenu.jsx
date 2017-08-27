import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, PureComponent } from 'react';
import { STATES } from 'meteor/vulcan:accounts';

import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';

class UsersAccountMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open:true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    let { state } = this.props;

    return (
      <div className="users-menu">
        <FlatButton label="Login" onTouchTap={this.handleTouchTap} />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Components.AccountsLoginForm />
        </Popover>
      </div>
    )
  }
}

registerComponent('UsersAccountMenu', UsersAccountMenu);
