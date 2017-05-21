import { Components, registerComponent, ModalTrigger } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Panel, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';



class FeedItem extends Component {


  render() {
    currentUser = this.props.currentUser;
    feed = this.props.feed;
    return (
      <ListGroupItem>
          {feed.nickname + ": "} <a href={feed.url}> {feed.url} </a>
          {feed.ownedByUser ? <span className="ownedByUserTag">owned by this user</span> : null}
          {feed.rawFeed ? <div>Latest Post: <a href={feed.rawFeed[0].link}>feed.rawFeed[0].title</a></div> : null}
          {feed.displayFullContent ? <span className="displayFullContentTag">fully mirrored on LessWrong</span> : null}
          <ModalTrigger label={"Edit"}>
              <Components.editFeedButton feed={feed}/>
          </ModalTrigger>
      </ListGroupItem>
    )
  }

}

registerComponent('FeedItem', FeedItem);
