/*

Component for displaying details about currently selected conversation

*/

import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser, getFragment } from 'meteor/vulcan:core';
import Notifications from "../collections/notifications/collection.js";
import Messages from "../collections/messages/collection.js";
import Conversations from '../collections/conversations/collection.js';
import SmartForm from "meteor/vulcan:forms";

class ConversationDetails extends Component {

  render() {

    const conversation = this.props.conversation;

    if(conversation && conversation.participants.length) {
      return (
        <div className="conversation-details">
          <ListGroup>
            <ListGroupItem> Title: {conversation.title}</ListGroupItem>
            <ListGroupItem> ID: {conversation._id}</ListGroupItem>
            <ListGroupItem> latestActivity: {conversation.latestActivity}</ListGroupItem>
            <ListGroupItem> Participants:
              {conversation.participants.map((user) => <div key={user._id}>{user.username} <Components.UsersAvatar user={user} /></div>)}
            </ListGroupItem>

            <ListGroupItem>Created At: {conversation.createdAt}</ListGroupItem>
            <ListGroupItem>More information about current conversation will be implemented soon!</ListGroupItem>
              <ListGroupItem>
                <ModalTrigger label="Edit Title" >
                  <Components.TitleEditForm documentId={conversation._id} currentUser={this.props.currentUser} />
                </ModalTrigger>
              </ListGroupItem>
          </ListGroup>
        </div>
      )
    } else {
      return <Components.Loading />
    }
  }



}

registerComponent('ConversationDetails', ConversationDetails, withCurrentUser);
