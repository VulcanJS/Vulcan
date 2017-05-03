import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';
import Users from 'meteor/vulcan:users';
import { withDocument, Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import { FormattedMessage, intlShape } from 'react-intl';
import { gql } from 'react-apollo';

const UsersProfileCheck = ({currentUser, document, loading, flash}, context) => {

  // we're loading all fields marked as "mustComplete" using withDocument
  const userMustCompleteFields = document;

  // if user is not logged in, or userMustCompleteFields is still loading, don't return anything
  if (!currentUser || loading) {

    return null;
  
  } else {
    
    // return fields that are required by the schema but haven't been filled out yet
    const fieldsToComplete = _.filter(Users.getRequiredFields(), fieldName => {
      return !userMustCompleteFields[fieldName];
    });

    if (fieldsToComplete.length > 0) {

      return (
        <Modal bsSize='small' show={ true }>
          <Modal.Header>
            <Modal.Title><FormattedMessage id="users.complete_profile"/></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Components.SmartForm
              collection={ Users }
              documentId={ currentUser._id }
              fields={ fieldsToComplete }
              successCallback={user => {
                const newUser = {...currentUser, ...user};
                if (Users.hasCompletedProfile(newUser)) {
                  flash(context.intl.formatMessage({id: "users.profile_completed"}), 'success');
                }
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <FormattedMessage id="app.or"/> <a className="complete-profile-logout" onClick={ () => Meteor.logout(() => window.location.reload() /* something is broken here when giving the apollo client as a prop*/) }><FormattedMessage id="users.log_out"/></a>
          </Modal.Footer>
        </Modal>
      )
    } else {
      
      return null;

    }
  }

};

UsersProfileCheck.propsTypes = {
  currentUser: React.PropTypes.object
};

UsersProfileCheck.contextTypes = {
  intl: intlShape
};

UsersProfileCheck.displayName = "UsersProfileCheck";

const mustCompleteFragment = gql`
  fragment UsersMustCompleteFragment on User {
    _id
    ${Users.getRequiredFields().join('\n')}
  }
`

const options = {
  collection: Users,
  queryName: 'usersMustCompleteQuery',
  fragment: mustCompleteFragment,
};

registerComponent('UsersProfileCheck', UsersProfileCheck, withMessages, [withDocument, options]);
