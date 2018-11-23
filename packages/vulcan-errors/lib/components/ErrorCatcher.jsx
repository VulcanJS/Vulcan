/*

ErrorCatcher

Usage: 

  <Components.ErrorCatcher>
    <YourComponentTree />
  </Components.ErrorCatcher>

*/

import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Errors } from '../modules/errors.js';

class ErrorCatcher extends Component {
  state = {
    error: null,
  };

  componentDidCatch = (error, errorInfo) => {
    const { currentUser } = this.props;
    this.setState({ error });
    Errors.log({
      message: error.message,
      error,
      details: errorInfo,
      currentUser,
    });
  };

  render() {
    const { error } = this.state;
    return error ? (
      <div className="error-catcher">
        <Components.Flash message={{ id: 'errors.generic_report', properties: { errorMessage: error.message } }} />
      </div>
    ) : (
      this.props.children
    );
  }
}

registerComponent('ErrorCatcher', ErrorCatcher, withCurrentUser);
