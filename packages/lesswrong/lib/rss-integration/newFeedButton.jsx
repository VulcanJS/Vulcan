/*

Button used to add a new feed to a user profile

*/

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser, getFragment } from 'meteor/vulcan:core';
import { Redirect, withRouter } from 'react-router';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import Posts from 'meteor/vulcan:posts'

class newFeedButton extends Component {

  render() {

    const user = this.props.user;
    const currentUser = this.props.currentUser;

    if (user && currentUser) {
      return (
        <div>
          <Components.SmartForm
            collection={RSSFeeds}
            mutationFragment={getFragment('newRSSFeedFragment')}
            prefilledProps={{userId: user._id}}
            successCallback={conversation => {
              this.props.closeModal();
            }}
          >
          </ Components.SmartForm>
          <Button onClick={() => this.props.closeModal()}>Close!</Button>
        </div>
      )
    } else {
      return <div> <Components.Loading /> </div>
    }
  }
}

registerComponent('newFeedButton', newFeedButton, withCurrentUser, withRouter);
