/*

Button used to add a new feed to a user profile

*/

import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser, getFragment } from 'meteor/vulcan:core';
import { Redirect, withRouter } from 'react-router';
import RSSFeeds from '../collections/rssfeeds/collection.js';
import Posts from 'meteor/vulcan:posts'

class editFeedButton extends Component {

  render() {

    const button = <a className="edit-rss-button"> Edit </a>;
    return (
      <Components.ModalTrigger title={'Edit'} component={button}>
        <Components.SmartForm
          collection={RSSFeeds}
          documentId={this.props.feed._id}
          mutationFragment={getFragment('RSSFeedMinimumInfo')}
          successCallback={feed => {
            this.props.closeModal();
            this.props.flash("Successfully edited feed", 'success');
          }}
          removeSuccessCallback={({documentId, documentTitle}) => {
            this.props.flash("Successfully deleted feed", "success");
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
        />
      </Components.ModalTrigger>
    )
  }
}

registerComponent('editFeedButton', editFeedButton, withCurrentUser, withRouter);
