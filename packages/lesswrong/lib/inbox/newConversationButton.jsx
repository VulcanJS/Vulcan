/*

Button used to start a new conversation for a given user

*/

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Components, registerComponent, withCurrentUser, getFragment } from 'meteor/vulcan:core';
import {  withRouter } from 'react-router';
import Conversations from '../collections/conversations/collection.js';
import Posts from 'meteor/vulcan:posts'

class newConversationButton extends Component {

  render() {

    const user = this.props.user;
    const currentUser = this.props.currentUser;

    if (user && currentUser) {
      return (
        <div>
          <Components.SmartForm
            collection={Conversations}
            mutationFragment={getFragment('newConversationFragment')}
            prefilledProps={{participantIds: [currentUser._id, user._id]}}
            successCallback={conversation => {
              this.props.closeModal();
              this.props.router.push({pathname: '/inbox', query: {select: conversation._id}});
            }}
          >
          </ Components.SmartForm>
          <Button onClick={() => this.props.closeModal()}>Close!</Button>
        </div>
      )
    } else {
      return <Components.Loading />
    }
  }
}

registerComponent('newConversationButton', newConversationButton, withCurrentUser, withRouter);
