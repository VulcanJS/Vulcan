import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import SmartForm from "meteor/nova:forms";
import Users from 'meteor/nova:users';
import { ShowIf, withCurrentUser, withMessages } from 'meteor/nova:core';

const UsersEditForm = (props, context) => {
  return (
    <ShowIf
      check={Users.options.mutations.edit.check}
      document={props.terms.documentId ? {_id: props.terms.documentId} : {slug: props.terms.slug}}
      failureComponent={<FormattedMessage id="app.noPermission"/>}
    >
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
        <SmartForm 
          collection={Users} 
          {...props.terms}
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
  terms: React.PropTypes.object, // a user is defined by its unique _id or its unique slug
};

UsersEditForm.contextTypes = {
  intl: intlShape
};

UsersEditForm.displayName = "UsersEditForm";

registerComponent('UsersEditForm', UsersEditForm, withMessages, withCurrentUser);
