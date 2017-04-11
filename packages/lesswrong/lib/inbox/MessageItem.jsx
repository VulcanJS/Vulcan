/*

Display of a single message in the Conversation Wrapper

*/

import React, { PropTypes, Component } from 'react';
import { Media } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Messages from "../collections/messages/collection.js";
import { convertFromRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

class MessageItem extends Component {

  render() {
    const currentUser = this.props.currentUser;
    const message = this.props.message;

    if (message.draftJS) {
      return (
        <Media>
          {(currentUser._id != message.user._id) ? <Media.Left> <Components.UsersAvatar user={message.user}/> </Media.Left> : <div></div>}
          <Media.Body>
            <Components.EditorWrapper initialState={message.draftJS} readOnly />
            <div>A message will be here</div>
          </Media.Body>
          {(currentUser._id == message.user._id) ? <Media.Right> <Components.UsersAvatar user={currentUser}/></Media.Right> : <div></div>}
        </Media>
      )
    } else {
      return (<Components.Loading />)
    }

  }

}

const options = {
  collection: Messages,
  queryName: 'messagesForConversation',
  fragmentName: 'messageListFragment',
  limit: 50,
};

registerComponent('MessageItem', MessageItem);
