import { Components, registerComponent, withCurrentUser } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';
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
          <DropdownButton bsStyle='default' title='Notifications'>
              <Components.NotificationsList terms={terms} />
          </DropdownButton>
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
