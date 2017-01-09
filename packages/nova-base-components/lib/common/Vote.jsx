import { Components, registerComponent } from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { withCurrentUser, withMessages } from 'meteor/nova:core';
import { withVote, hasUpvoted, hasDownvoted } from 'meteor/nova:voting';

class Vote extends Component {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
    // this.startLoading = this.startLoading.bind(this);
    // this.stopLoading = this.stopLoading.bind(this);

    this.hasUpvoted = hasUpvoted;
    this.hasDownvoted = hasDownvoted;

    this.state = {
      loading: false
    }
  }

  /*

  note: with optimisitc UI, loading functions are not needed
  also, setState triggers issues when the component is unmounted
  before the vote mutation returns. 

  */

  // startLoading() {
  //   this.setState({ loading: true });
  // }

  // stopLoading() {
  //   this.setState({ loading: false });
  // }

  upvote(e) {
    e.preventDefault();

    // this.startLoading();

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash("Please log in first");
      // this.stopLoading();
    } else {
      const voteType = this.hasUpvoted(user, document) ? "cancelUpvote" : "upvote";
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser}).then(result => {
        // this.stopLoading();
      });
    } 
  }

  render() {

    // uncomment for debug:
    // console.log('hasUpvoted', hasUpvoted);
    // console.log('this.hasUpvoted', this.hasUpvoted);

    const document = this.props.document;
    const user = this.props.currentUser;

    const hasUpvoted = this.hasUpvoted(user, document);
    const hasDownvoted = this.hasDownvoted(user, document);
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
          <div className="vote-count">{document.baseScore || 0}</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  document: React.PropTypes.object.isRequired, // the document to upvote
  collection: React.PropTypes.object.isRequired, // the collection containing the document
  vote: React.PropTypes.func, // mutate function with callback inside
  currentUser: React.PropTypes.object,
};

Vote.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
};

registerComponent('Vote', Vote, withCurrentUser, withMessages, withVote);
