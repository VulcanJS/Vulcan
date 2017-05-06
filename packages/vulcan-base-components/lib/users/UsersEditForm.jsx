import { Components, registerComponent, withCurrentUser, withMessages } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage, intlShape } from 'react-intl';
import Users from 'meteor/vulcan:users';
import { STATES } from 'meteor/vulcan:accounts';

const UsersEditForm = (props, context) => {
  return (
    <Components.ShowIf
      check={Users.options.mutations.edit.check}
      document={props.terms.documentId ? {_id: props.terms.documentId} : {slug: props.terms.slug}}
      failureComponent={<FormattedMessage id="app.noPermission"/>}
    >
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title"><FormattedMessage id="users.edit_account"/></h2>
        
        <div className="change-password-link">
          <Components.ModalTrigger size="small" title={context.intl.formatMessage({id: "accounts.change_password"})} component={<a href="#"><FormattedMessage id="accounts.change_password" /></a>}>
            <Components.AccountsLoginForm formState={STATES.PASSWORD_CHANGE} />
          </Components.ModalTrigger>
        </div>

        <Components.SmartForm 
          collection={Users} 
          {...props.terms}
          successCallback={user => {
            props.flash(context.intl.formatMessage({id: "users.edit_success"}, {name: Users.getDisplayName(user)}), 'success')
          }}
          showRemove={true}
        />
      </div>
    </Components.ShowIf>
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
