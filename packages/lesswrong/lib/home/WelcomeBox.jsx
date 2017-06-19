import React, { Component } from 'react';
import { Link } from 'react-router';
import { Components, registerComponent } from 'meteor/vulcan:core';

class WelcomeBox extends Component {

  render() {
    return (
      <div className="home-welcomebox">
        <h2> Welcome to the closed beta of LessWrong 2.0</h2>
        <div>
          <p>This is a closed beta of the new Lesswrong with imported posts from the original Lesswrong site. </p>
          <p>
            While the domain-name is temporary, the content is not. If the new codebase is approved by the users, we’ll be merging content from the two domains and having lesswrong.com point to the new site.
          </p>
          <p>
            Use the new LessWrong to discuss rationality, global catastrophic risk and other important issues that you care about with the other closed-beta users. And please let us know if you have any suggestions or feedback by using the chat button in the bottom-right corner of the page!
          </p>
        </div>
      </div>
    )
  }

}

registerComponent('WelcomeBox', WelcomeBox);
