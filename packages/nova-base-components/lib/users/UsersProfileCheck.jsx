import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'react-bootstrap';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import Users from 'meteor/nova:users';
import { withCurrentUser } from 'meteor/nova:core';

const UsersProfileCheckModal = ({show, router, currentUser}, context) => {

  // return fields that are required by the schema but haven't been filled out yet
  const schema = Telescope.utils.stripTelescopeNamespace(Users.simpleSchema()._schema);
  const requiredFields = _.filter(_.keys(schema), (fieldName) => {
    var field = schema[fieldName];
    return !!field.required && !Telescope.getNestedProperty(currentUser, fieldName);
  });

  return (
    <Modal bsSize='small' show={ show }>
      <Modal.Header>
        <Modal.Title><FormattedMessage id="users.complete_profile"/></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NovaForm
          collection={ Users }
          document={ currentUser }
          fields={ requiredFields }
        />
      </Modal.Body>
      <Modal.Footer>
        <FormattedMessage id="app.or"/> <a className="complete-profile-logout" onClick={ () => Meteor.logout(() => window.location.reload() /* something is broken here when giving the apollo client as a prop*/) }><FormattedMessage id="users.log_out"/></a>
      </Modal.Footer>
    </Modal>
  )
};

const UsersProfileCheck = ({currentUser}, context) => {
  // console.log('current user', currentUser);
  // console.log('profile completed', !Users.hasCompletedProfile(currentUser));
  return currentUser ? <UsersProfileCheckModal currentUser={currentUser} show={!Users.hasCompletedProfile(currentUser)}/> : null;
};

UsersProfileCheck.propsTypes = {
  currentUser: React.PropTypes.object
};

UsersProfileCheck.displayName = "UsersProfileCheck";

Telescope.registerComponent('UsersProfileCheck', UsersProfileCheck, withCurrentUser, withRouter);