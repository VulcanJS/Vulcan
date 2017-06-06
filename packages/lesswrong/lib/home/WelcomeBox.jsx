import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

class WelcomeBox extends Component {

  render() {
    return (
      <div className="home-welcomebox">
        <h2> Welcome to the closed beta of LessWrong 2.0</h2>
        <div>
          LessWrong 2.0 is a project, with some words, and some stuff.
        </div>
      </div>
    )
  }

}

registerComponent('WelcomeBox', WelcomeBox);
