/*

Display of a single message in the Conversation Wrapper

*/

import React, { PropTypes, Component } from 'react';
import { Media } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Messages from "../collections/messages/collection.js";

class MessageItem extends Component {

  render() {
    const currentUser = this.props.currentUser;
    const message = this.props.message;


    return (
      <Media>
        {(currentUser._id != message.user._id) ? <Media.Left> <Components.UsersAvatar user={message.user}/> </Media.Left> : <div></div>}
        <Media.Body>
          {message.messageMD}
        </Media.Body>
        {(currentUser._id == message.user._id) ? <Media.Right> <Components.UsersAvatar user={currentUser}/></Media.Right> : <div></div>}
      </Media>
    )

  }



}

const options = {
  collection: Messages,
  queryName: 'messagesForConversation',
  fragmentName: 'messageListFragment',
  limit: 50,
};

registerComponent('MessageItem', MessageItem);
