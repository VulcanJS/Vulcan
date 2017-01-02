import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import SmartForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';
import { ShowIf, withCurrentUser, withDocument, withMessages } from 'meteor/nova:core';
import gql from 'graphql-tag';

const UsersEditForm = (props, context) => {
  return (
    <ShowIf
      check={Users.options.mutations.edit.check}
      document={{_id: props.userId || props.document && props.document._id}}
      failureComponent={<FormattedMessage id="app.noPermission"/>}
    >
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
        <SmartForm 
          collection={Users} 
          documentId={props.userId || props.document && props.document._id}
          queryToUpdate="usersSingleQuery"
          successCallback={user => {
            props.flash(context.intl.formatMessage({id: "users.edit_success"}, {name: Users.getDisplayName(user)}), 'success')
          }}
          showRemove={true}
        />
      </div>
    </ShowIf>
  );
};


UsersEditForm.propTypes = {
  document: React.PropTypes.object,
};

UsersEditForm.contextTypes = {
  intl: intlShape
};

UsersEditForm.displayName = "UsersEditForm";

UsersEditForm.fragment = gql` 
  fragment UsersEditFormFragment on User {
    _id
    __slug
  }
`;

const options = {
  collection: Users,
  queryName: 'usersEditPermissionCheckQuery',
  fragment: UsersEditForm.fragment,
};

registerComponent('UsersEditForm', UsersEditForm, withCurrentUser, withDocument(options), withMessages);
