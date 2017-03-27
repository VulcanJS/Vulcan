import { registerComponent } from 'meteor/vulcan:lib';
import React, { PropTypes } from 'react';
import withCurrentUser from '../containers/withCurrentUser.js';

const ShowIf = props => {
  const { check, document, failureComponent = null, currentUser, children } = props;
  return check(currentUser, document) ? children : failureComponent;
};

ShowIf.propTypes = {
  check: React.PropTypes.func.isRequired,
  currentUser: React.PropTypes.object,
  document: React.PropTypes.object,
  failureComponent: React.PropTypes.object,
};

ShowIf.displayName = "ShowIf";

registerComponent('ShowIf', ShowIf, withCurrentUser);

export default withCurrentUser(ShowIf);