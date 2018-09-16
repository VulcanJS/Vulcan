import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';
import withCurrentUser from '../containers/withCurrentUser.js';

const ShowIf = props => {
  const { check, document, failureComponent = null, currentUser, children } = props;
  return check(currentUser, document) ? children : failureComponent;
};

ShowIf.propTypes = {
  check: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  document: PropTypes.object,
  failureComponent: PropTypes.object,
};

ShowIf.displayName = 'ShowIf';

registerComponent('ShowIf', ShowIf, withCurrentUser);