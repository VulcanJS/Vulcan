// Deprecated way to handle permission in components, check CanDo component

// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes, Component } from 'react';
// import { FormattedMessage } from 'react-intl';
// import Users from 'meteor/nova:users';

// const CanCreatePost = (props, context) => {

//   const currentUser = context.currentUser;

//   const children = props.children;
//   const UsersAccountForm = Telescope.components.UsersAccountForm;

//   if (!currentUser){
//     return (
//       <div className="log-in-message">
//         <h3><FormattedMessage id="users.please_log_in"/></h3>
//         <UsersAccountForm/>
//       </div>
//     )
//   } else if (Users.canDo(currentUser, "posts.new")) {
//     return children;
//   } else {
//     return <p><FormattedMessage id="users.cannot_post"/></p>;
//   }
// };

// CanCreatePost.contextTypes = {
//   currentUser: React.PropTypes.object
// };

// CanCreatePost.displayName = "CanCreatePost";

// module.exports = CanCreatePost;