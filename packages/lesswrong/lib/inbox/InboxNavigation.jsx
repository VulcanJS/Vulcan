/*

The Navigation for the Inbox components

*/

import React, { PropTypes, Component } from 'react';
import { withRouter } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import moment from 'moment';
import Notifications from '../collections/notifications/collection.js'
import Conversations from '../collections/conversations/collection.js';

class InboxNavigation extends Component {

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    const select = this.props.location.query.select;

    const messagesTerms = {view: 'messagesConversation', conversationId: select};

    if(currentUser && results && results.length) {
      let conversation = results.find(c => (c._id == select));
      console.log("InboxNavigation conversation: ", conversation);
      let notificationsSelect = (select == "Notifications");
      return (
        <Grid>
          <Row className="Inbox-Grid">
            <Col xs={12} md={3}>{this.renderNavigation()}</Col>
            <Col xs={12} style={{position: "inherit"}} md={(notificationsSelect ? 9 : 6)}>
              {notificationsSelect ? <Components.NotificationsWrapper/> : <Components.ConversationWrapper terms={messagesTerms} conversation={conversation} />}
            </Col>
            {notificationsSelect ? <div></div> : <Col xs={12} md={3}><Components.ConversationDetails conversation={conversation}/></Col>}
          </Row>
        </Grid>
      )
    } else {
      return <div></div>
    }
  }

  renderNavigation() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;

    //TODO: Add ability to add conversation from Inbox page, by searching for a user id:15

    if(results && results.length){
      return (
        <ListGroup>
          <LinkContainer to={{pathname: "/inbox", query: {select: "Notifications"}}}>
            <ListGroupItem header="All Notifications">
            </ListGroupItem>
          </LinkContainer>
          {results.map(conversation =>
            <LinkContainer key={conversation._id} to={{pathname: "/inbox", query: {select: conversation._id}}}>
              <ListGroupItem>
                {!!conversation.title ? conversation.title : _.pluck(conversation.participants, 'username').join(' - ')}
                <br></br> {conversation.latestActivity ? moment(new Date(conversation.latestActivity)).fromNow() : null}
              </ListGroupItem>
            </LinkContainer>)
          }
        </ListGroup>
      );
    } else {
      return <div>Loading...</div>;
    }
  }

}

const conversationOptions = {
  collection: Conversations,
  queryName: 'conversationsListQuery',
  fragmentName: 'conversationsListFragment',
  limit: 20,
};

registerComponent('InboxNavigation', InboxNavigation, withList(conversationOptions), withCurrentUser, withRouter);
