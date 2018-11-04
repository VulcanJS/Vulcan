import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import classNames from 'classnames';
import { Errors } from 'meteor/vulcan:errors';

class ErrorsUserMonitor extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.checkCurrentUser();
  }

  componentDidUpdate() {
    this.checkCurrentUser();
  }

  checkCurrentUser(prevProps, prevState, snapshot) {
    const currentUser = this.props.currentUser;

    const currentUserId = currentUser && currentUser._id;
    const errorsUserId = Errors.currentUser && Errors.currentUser._id;

    if (currentUserId !== errorsUserId) {
      const currentUserEmail = currentUser && currentUser.email;
      const errorsUserEmail = Errors.currentUser && Errors.currentUser.email;

      console.log(`User changed from ${errorsUserEmail} (${errorsUserId}) to ${currentUserEmail} (${currentUserId})`);

      Errors.setCurrentUser(currentUser);
    }
  }

  render() {
    const { className, currentUser } = this.props;

    return (
      <div
        className={classNames(
          'errors-user-monitor',
          (currentUser && currentUser._id) || 'no-user',
          currentUser && currentUser.email,
          className
        )}
      />
    );
  }
}

ErrorsUserMonitor.propTypes = {
  className: PropTypes.string,
  currentUser: PropTypes.object,
};

ErrorsUserMonitor.displayName = 'ErrorsUserMonitor';

registerComponent('ErrorsUserMonitor', ErrorsUserMonitor, withCurrentUser);
