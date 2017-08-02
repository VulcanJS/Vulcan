import React from 'react';
import Users from 'meteor/vulcan:users';
import { Components, withMessages } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';

const Username = ({ user }) => 
  <div>
    <Components.Avatar user={user} link={false}/> 
    <span>{Users.getDisplayName(user)}</span>
  </div>

const EditForm = ({ user, closeModal, flash, intl }) =>
  <Components.SmartForm 
    collection={Users} 
    documentId={user._id}
    successCallback={user => {          
      closeModal();
      flash(intl.formatMessage({ id: 'users.edit_success' }, {name: Users.getDisplayName(user)}), 'success')
    }}
    showRemove={true}
  />

const AdminUsersName = ({ document: user, flash }, context) => 
  <div>

    <Components.ModalTrigger title={`${context.intl.formatMessage({ id: 'users.edit_account'})}: ${Users.getDisplayName(user)}`} component={<div><Username user={user} /></div>}>
      <EditForm user={user} flash={flash} intl={context.intl} />
    </Components.ModalTrigger>

    {_.rest(Users.getGroups(user)).map(group => <code key={group}>{group}</code>)}
  
  </div>

AdminUsersName.contextTypes = {
  intl: intlShape
};

export default withMessages(AdminUsersName);