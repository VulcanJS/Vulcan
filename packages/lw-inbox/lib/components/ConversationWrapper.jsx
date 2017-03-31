/*

The Navigation for the Inbox components

*/

import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader, Panel } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Notifications from "meteor/lw-notifications";
import { Messages } from "../collection.js";
import SmartForm from "meteor/vulcan:forms";

class ConversationWrapper extends Component {

  renderMessages(results, currentUser) {
    if (results && results.length) {
      return (
        <div>
          {results.map((message) => (<Components.MessageItem key={message._id} currentUser={currentUser} message={message} />))}
        </div>);
    } else {
     return <div>No Results</div>
    };
  }

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    const conversation = this.props.conversation;

    if (loading) {
      return (<Components.Loading/>)
    } else if (conversation) {
      return (
        <div>
          <PageHeader>
            {!!conversation.title ? conversation.title : _.pluck(conversation.participants, 'username').join(', ')}
            <br></br> <small>{conversation.createdAt}</small>
          </PageHeader>
          {this.renderMessages(results, currentUser)}
          <div style={ {marginTop: '40px'} }>
            <SmartForm
              collection={Messages}
              prefilledProps={ {conversationId: conversation._id} }
              successCallback={(message) => {refetch()}}
              errorCallback={(message)=> console.log("Failed to send", error)}
            />
          </div>
        </div>
      )
    } else {
      return <div>No Conversation Selected</div>
    }
  }



}

const options = {
  collection: Messages,
  queryName: 'messagesForConversation',
  fragmentName: 'messageListFragment',
  limit: 50,
};

registerComponent('ConversationWrapper', ConversationWrapper, withList(options), withCurrentUser);
