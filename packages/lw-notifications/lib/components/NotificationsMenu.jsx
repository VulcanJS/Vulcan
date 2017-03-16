import { Components, registerComponent, withCurrentUser } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/nova:users';
import { withApollo } from 'react-apollo';

class NotificationsMenu extends Component {

  render() {

    const {currentUser, client} = this.props;

    if(!currentUser){
      return (<div></div>);
    } else {
      const terms = {view: 'userNotifications', userId: currentUser._id};
      return (
        <div className="notifications-menu">
          <Dropdown id="notifications-dropdown">
            <Dropdown.Toggle>
              <div>Notifications</div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <div>Notifications: </div>
              <Components.NotificationsList terms={terms} />
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )
      }
  }

}

NotificationsMenu.propsTypes = {
  currentUser: React.PropTypes.object,
  client: React.PropTypes.object,
};



registerComponent('NotificationsMenu', NotificationsMenu, withCurrentUser, withApollo);
