import {Components, getRawComponent, replaceComponent} from 'meteor/vulcan:core';
import React, {PropTypes, Component} from 'react';
import {hasDownvoted} from 'meteor/vulcan:voting';


class LWVote extends getRawComponent('Vote') {
  constructor() {
    super();
    this.downvote = this.downvote.bind(this);
    this.upvote = this.upvote.bind(this);
  }

  // CUSTOM CODE STARTS HERE

  downvote(e) { //Downvote function. Copied functionality from upvote function in base-package
    e.preventDefault();

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
    } else {
      const voteType = hasDownvoted(user, document) ? "cancelDownvote" : "downvote";
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser});
    }
  }


  render() { //Slightly modified render function. Added downvote button
    return (
      <div className={this.getActionClass()}>
        <div className="vote-count">{this.props.document.baseScore || 0} points</div>
        <a className="upvote-button" onClick={this.upvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="upvote" /> }
            <div className="sr-only">Upvote</div>
        </a>
        <a className="downvote-button" onClick={this.downvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="downvote" /> }
            <div className="sr-only">Downvote</div>
        </a>
      </div>
    )
  }
}

replaceComponent('Vote', LWVote);
