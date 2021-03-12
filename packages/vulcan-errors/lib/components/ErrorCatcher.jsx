/*

ErrorCatcher

Usage: 

  <Components.ErrorCatcher>
    <YourComponentTree />
  </Components.ErrorCatcher>

*/

import { Components, registerComponent, withCurrentUser, withSiteData } from 'meteor/vulcan:core';
import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Errors } from '../modules/errors.js';

const getMessage = error => error.message || error.errorMessage;

class ErrorCatcher extends Component {
  state = {
    error: null,
  };

  componentDidCatch = (error, errorInfo) => {
    const { currentUser, siteData = {} } = this.props;
    const { sourceVersion } = siteData;
    this.setState({ error });
    Errors.log({
      message: getMessage(error),
      error,
      details: { ...errorInfo, sourceVersion },
      currentUser,
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.location &&
      prevProps.location &&
      this.props.location.pathname &&
      prevProps.location.pathname &&
      prevProps.location.pathname !== this.props.location.pathname
    ) {
      // reset the component state when the route changes to re-render the app and avodi blocking the navigation
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    return error ? <Components.ErrorCatcherContents error={error} message={getMessage(error)} /> : this.props.children;
  }
}

registerComponent('ErrorCatcher', ErrorCatcher, withCurrentUser, withSiteData, withRouter);

const ErrorCatcherContents = ({ error, message }) => (
  <div className="error-catcher">
    <Components.Flash message={{ message, properties: error }} />
  </div>
);

registerComponent('ErrorCatcherContents', ErrorCatcherContents);
