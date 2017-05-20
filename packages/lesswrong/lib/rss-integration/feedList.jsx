import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader, Panel } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import RSSFeeds from '../collections/rssfeeds/collection.js';

class FeedList extends Component {

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    const loadMore = this.props.loadMore;
    const totalCount = this.props.totalCount;

    if (results && results.length) {
      return (
        <ListGroup>
          {results.map(feed => {
            return <Components.FeedItem key={feed._id} feed={feed} />
          })}
          {(results.length < totalCount) ? <ListGroupItem  onClick={() => loadMore()}> Load More </ListGroupItem> : <ListGroupItem>All Feeds loaded</ListGroupItem>}
        </ListGroup>
      )
    } else {
      return <Components.Loading />
    }
  }
}

const options = {
  collection: RSSFeeds,
  queryName: 'userRSSListQuery',
  fragmentName: 'RSSFeedMinimumInfo',
  limit: 30,
};

registerComponent('FeedList', FeedList, withList(options), withCurrentUser);
