import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Panel, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';



class FeedItem extends Component {


  render() {
    currentUser = this.props.currentUser;
    feed = this.props.feed;
    return (
      <ListGroupItem>
          {feed.nickname + ": " + feed.url + "\n"}
          {"ownedByUser: " + feed.ownedByUser + "\n"}
          {"displayFullContent: " + feed.displayFullContent + "\n"}
          <Components.editFeedButton feed={feed}/>
      </ListGroupItem>
    )
  }

}

registerComponent('FeedItem', FeedItem);
