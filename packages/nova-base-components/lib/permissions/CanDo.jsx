// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes } from 'react';
// import { FormattedMessage } from 'react-intl';
// import Users from 'meteor/nova:users';
// import { withCurrentUser } from 'meteor/nova:core';

// const CanDo = (props, context) => {
  
//   // no user login, display the login form
//   if (!props.currentUser && props.displayNoPermissionMessage) {
//     return (
//       <div className="log-in-message">
//         <h3><FormattedMessage id="users.please_log_in"/></h3>
//         <Telescope.components.UsersAccountForm />
//       </div>
//     );
//   }

//   // default permission, is the user allowed to perform this action?
//   let permission = Users.canDo(props.currentUser, props.action);

//   // the permission is about viewing a document, check if the user is allowed
//   if (props.document && props.action.indexOf('view') > -1) {
//     // use the permission shortcut canView on the current user and requested document
//     permission = Users.canView(props.currentUser, props.document);
//   }

//   // the permission is about editing a document, check if the user is allowed
//   if (props.document && props.action.indexOf('edit') > -1) {
//     // use the permission shortcut canEdit on the current user and requested document
//     permission = Users.canEdit(props.currentUser, props.document);
//   }


//   // the user can perform the intented action in the component: display the component, 
//   // else: display a not allowed message
//   if (permission) {
//     return props.children;
//   } else {
//     return props.displayNoPermissionMessage ? <p><FormattedMessage id={props.noPermissionMessage}/></p> : null;
//   }
// };

// CanDo.propTypes = {
//   action: React.PropTypes.string.isRequired,
//   currentUser: React.PropTypes.object,
//   document: React.PropTypes.object,
//   noPermissionMessage: React.PropTypes.string,
//   displayNoPermissionMessage: React.PropTypes.bool,
// };

// CanDo.defaultProps = {
//   noPermissionMessage: 'app.noPermission',
//   displayNoPermissionMessage: false,
// };

// CanDo.displayName = "CanDo";

// Telescope.registerComponent('CanDo', CanDo, withCurrentUser);