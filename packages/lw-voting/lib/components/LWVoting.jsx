import {Components, getRawComponent, replaceComponent} from 'meteor/nova:core';
import React, {PropTypes, Component} from 'react';
import classNames from 'classnames';
import {withCurrentUser, withMessages} from 'meteor/nova:core';
import {withVote, hasUpvoted, hasDownvoted} from 'meteor/nova:voting';


class LWVote extends getRawComponent('Vote') {
  constructor() {
    super();
    this.downvote = this.downvote.bind(this);
    this.upvote = this.upvote.bind(this);
  }

  // CUSTOM CODE STARTS HERE

  downvote(e) { //Downvote function. Copied functionality from upvote function in base-package
    e.preventDefault();

    // this.startLoading();

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
      // this.stopLoading();
    } else {
      const voteType = hasDownvoted(user, document) ? "cancelDownvote" : "downvote";
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser}).then(result => {
        // this.stopLoading();
      });
    }
  }


  render() { //Slightly modified render function. Added downvote button
    return (
      <div className={this.getActionClass()}>
        <a className="upvote-button" onClick={this.upvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="upvote" /> }
            <div className="sr-only">Upvote</div>
        </a>
            <div className="vote-count">{this.props.document.baseScore || 0}</div>
        <a className="downvote-button" onClick={this.downvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="downvote" /> }
            <div className="sr-only">Downvote</div>
        </a>
      </div>
    )
  }
}

replaceComponent('Vote', LWVote);
