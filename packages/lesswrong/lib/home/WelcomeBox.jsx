import React, { Component } from 'react';
import { Link } from 'react-router';
import { Components, registerComponent } from 'meteor/vulcan:core';

class WelcomeBox extends Component {

  render() {
    return (
      <div className="home-welcomebox">
        <h2> Welcome to the closed beta of LessWrong 2.0</h2>
        <div>
          LessWrong has changed significantly over the years, and LesserWrong is the next step. This is a closed beta with imported historical material from LessWrong. While the URL is temporary, the content is not; if the new codebase is approved by the users, we’ll be merging content from the two domains together and will move this platform to the lesswrong.com domain. (As a result, we recommend against linking to lesserwrong URLs in the meantime.) <br/>
          <br/>
          One of our goals with this new platform is to improve the experience of reading the sequences. While many improvements are still in development, you can already give it a shot by finding the first post in the original sequences <Link to="/posts/teaxCFgtmCQ3E9fy8/the-martial-art-of-rationality">here</Link>. Other than that, use this platform platform to discuss rationality, global catastrophic risk and other important issues that you care about with the other closed-beta users, And don't forget to let us know if you have any suggestions for improving the page! <br/>
        </div>
      </div>
    )
  }

}

registerComponent('WelcomeBox', WelcomeBox);
