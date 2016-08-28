import Telescope from 'meteor/nova:lib';
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Users from 'meteor/nova:users';

const CanDo = (props, context) => {
  // no user login, display the login form
  if (!context.currentUser && props.displayNoPermissionMessage) {
    return (
      <div className="log-in-message">
        <h3><FormattedMessage id="users.please_log_in"/></h3>
        <Telescope.components.UsersAccountForm />
      </div>
    );
  }

  // default permission, is the user allowed to perform this action?
  let permission = Users.canDo(context.currentUser, props.action);

  // the permission is about viewing a document, check if the user is allowed
  if (props.document && props.action.indexOf('view') > -1) {
    // use the permission shortcut canView on the current user and requested document
    permission = Users.canView(context.currentUser, props.document);
  }

  // the permission is about editing a document, check if the user is allowed
  if (props.document && props.action.indexOf('edit') > -1) {
    // use the permission shortcut canEdit on the current user and requested document
    permission = Users.canEdit(context.currentUser, props.document);
  }

  // the user can perform the intented action in the component: display the component, 
  // else: display a not allowed message
  if (permission) {
    return props.children;
  } else {
    return props.displayNoPermissionMessage ? <p><FormattedMessage id={props.noPermissionMessage}/></p> : null;
  }
};

CanDo.contextTypes = {
  currentUser: React.PropTypes.object
};

CanDo.propTypes = {
  action: React.PropTypes.string.isRequired,
  document: React.PropTypes.object,
  noPermissionMessage: React.PropTypes.string,
  displayNoPermissionMessage: React.PropTypes.bool,
};

CanDo.defaultProps = {
  noPermissionMessage: 'app.noPermission',
  displayNoPermissionMessage: false,
};

CanDo.displayName = "CanDo";

module.exports = CanDo;
export default CanDo;