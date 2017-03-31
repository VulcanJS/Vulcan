/*

The Navigation for the Inbox components

*/

import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Notifications from "meteor/lw-notifications";
import { Conversations } from "../collection.js";

class InboxNavigation extends Component {

  constructor(props) {
    super(props);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.selectConversation = this.selectConversation.bind(this);
    this.state = {selectedConversation: "Notifications"};
  }

  renderNavigation() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;

    //TODO: Add ability to add conversation from Inbox page, by searching for a user

    if(results && results.length){
      return (
        <ListGroup>
          <ListGroupItem
            header="Notifications"
            bsStyle="info"
            onClick={()=> this.setState({selectedConversation: "Notifications"})}>Click here to see all your notifications
          </ListGroupItem>
          {results.map(conversation =>
            <ListGroupItem key={conversation._id} onClick={this.selectConversation(conversation._id)}>
              {!!conversation.title ? conversation.title : _.pluck(conversation.participants, 'username').join(' - ')}
              <br></br> {conversation.latestActivity}
            </ListGroupItem>)
          }
        </ListGroup>
      );
    } else {
      return <div>Loading...</div>;
    }
  }

  selectConversation(conversationId) {

    return () => {
      this.setState({selectedConversation: conversationId});
    };
  }

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    let conversation = results.find(c => (c._id == this.state.selectedConversation));
    let notificationsSelect = (this.state.selectedConversation == "Notifications");

    const messagesTerms = {view: 'messagesConversation', conversationId: this.state.selectedConversation};

    if(currentUser && results && results.length) {
      return (
        <Grid>
          <Row className="Inbox-Grid">
            <Col xs={12} md={3}>{this.renderNavigation()}</Col>
            <Col xs={12} md={(notificationsSelect ? 9 : 6)}>
              {notificationsSelect ? <Components.NotificationsWrapper/> : <Components.ConversationWrapper terms={messagesTerms} conversation={conversation} />}
            </Col>
            {notificationsSelect ? <div></div> : <Col xs={12} md={3}><Components.ConversationDetails conversation={conversation}></Components.ConversationDetails></Col>}
          </Row>
        </Grid>
      )
    } else {
      return <div></div>
    }
  }
}

const notificationOptions = {
  collection: Notifications,
  queryName: 'notificationsListQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 50,
};

const conversationOptions = {
  collection: Conversations,
  queryName: 'conversationsListQuery',
  fragmentName: 'conversationsListFragment',
  limit: 20,
};

registerComponent('InboxNavigation', InboxNavigation, withList(conversationOptions), withCurrentUser);
