import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { withCurrentUser, withMessages } from 'meteor/nova:core';
import { withVote, hasUpvoted, hasDownvoted } from 'meteor/nova:voting';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);

    this.hasUpvoted = hasUpvoted;
    this.hasDownvoted = hasDownvoted;

    this.state = {
      loading: false
    }
  }

  startLoading() {
    this.setState({ loading: true });
  }

  stopLoading() {
    this.setState({ loading: false });
  }

  upvote(e) {
    e.preventDefault();

    this.startLoading();

    const post = this.props.post;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash("Please log in first");
      this.stopLoading();
    } else {
      const voteType = this.hasUpvoted(user, post) ? "cancelUpvote" : "upvote";
      this.props.vote({post, voteType, currentUser: this.props.currentUser}).then(result => {
        this.stopLoading();
      });
    }
  }

  downvote(e) {
    e.preventDefault();

    this.startLoading();

    const post = this.props.post;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash("Please log in first");
      this.stopLoading();
    } else {
      const voteType = this.hasDownvoted(user, post) ? "cancelDownvote" : "downvote";
      this.props.vote({post, voteType, currentUser: this.props.currentUser}).then(result => {
        this.stopLoading();
      });
    }
  }

  render() {

    // uncomment for debug:
    // console.log('hasUpvoted', hasUpvoted);
    // console.log('this.hasUpvoted', this.hasUpvoted);

    const post = this.props.post;
    const user = this.props.currentUser;

    const hasUpvoted = this.hasUpvoted(user, post);
    const hasDownvoted = this.hasDownvoted(user, post);
    const actionsClass = classNames(
      "vote",
      {voted: hasUpvoted || hasDownvoted},
      {upvoted: hasUpvoted},
      {downvoted: hasDownvoted}
    );

    return (
      <div className={actionsClass}>
        <a className="upvote-button" onClick={this.upvote}>
          {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="upvote" /> }
          <div className="sr-only">Upvote</div>
        </a>
        <div className="vote-count">{post.baseScore || 0}</div>
        <a className="downvote-button" onClick={this.downvote}>
          {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="downvote" /> }
          <div className="sr-only">Downvote</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  post: React.PropTypes.object.isRequired, // the current post
  vote: React.PropTypes.func, // mutate function with callback inside
  currentUser: React.PropTypes.object,
};

Vote.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
};

registerComponent('Vote', Vote, withCurrentUser, withMessages, withVote);
