/*

This variant of the Vote.jsx component implements a loading spinner instead of 
optimistic response

*/
import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote } from '../containers/withVote.js';

class Vote extends PureComponent {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
    this.hasVoted = this.hasVoted.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
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

  hasVoted() {
    return this.props.document.currentUserVotes && this.props.document.currentUserVotes.length;
  }

  upvote(e) {
    e.preventDefault();

    this.startLoading();
    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
      this.stopLoading();
    } else {
      const operationType = this.hasVoted() ? 'cancelVote' : 'upvote';
      this.props.vote({document, operationType, collection, currentUser: this.props.currentUser}).then(result => {
        this.stopLoading();
      });
    } 
  }

  getActionClass() {

    const actionsClass = classNames(
      'vote', 
      {voted: this.hasVoted()},
    );

    return actionsClass;
  }

  render() {
    return (
      <div className={this.getActionClass()}>
        <a className="upvote-button" onClick={this.upvote}>
          {this.state.loading ? <Components.Icon name="spinner" /> : <Components.Icon name="upvote" /> }
          <div className="sr-only">Upvote</div>
          <div className="vote-count">{this.props.document.baseScore || 0}</div>
        </a>
      </div>
    )
  }

}

Vote.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
};

registerComponent('Upvote', Vote, withMessages, withVote);
