import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote } from '../containers/withVote.js';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

class Vote extends PureComponent {

  constructor() {
    super();
    this.vote = this.vote.bind(this);
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.hasVoted = this.hasVoted.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
    // this.startLoading = this.startLoading.bind(this);
    // this.stopLoading = this.stopLoading.bind(this);
    this.state = {
      loading: false
    }
  }

  hasVoted() {
    return this.props.document.currentUserVotes && this.props.document.currentUserVotes.length;
  }

  vote(voteType) {

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
    } else {
      const operationType = this.hasVoted() ? 'cancelVote' : voteType;
      this.props.vote({document, operationType, collection, currentUser: this.props.currentUser});
    } 
  }

  upvote(e) {
    e.preventDefault();
    this.vote('upvote');
  }

  downvote(e) {
    e.preventDefault();
    this.vote('downvote');
  }

  getActionClass() {

    const actionsClass = classNames(
      'vote-button',
      {'show-downvote': this.props.showDownvote},
      {'hide-downvote': !this.props.showDownvote},
      {voted: this.hasVoted()},
    );

    return actionsClass;
  }

  render() {
    if (this.props.showDownvote) {
      return (
        <div className={this.getActionClass()}>
          <a className="upvote-button" onClick={this.upvote}>
            <Components.Icon name="upvote" />
            <div className="sr-only"><FormattedMessage id="voting.upvote"/></div>
          </a>
          <div className="vote-count">{this.props.document.baseScore || 0}</div>
          <a className="downvote-button" onClick={this.downvote}>
            <Components.Icon name="downvote" />
            <div className="sr-only"><FormattedMessage id="voting.downvote"/></div>
          </a>
        </div>
      )
    } else {
      return (
        <div className={this.getActionClass()}>
          <a className="upvote-button" onClick={this.upvote}>
            <Components.Icon name="upvote" />
            <div className="sr-only"><FormattedMessage id="voting.upvote"/></div>
            <div className="vote-count">{this.props.document.baseScore || 0}</div>
          </a>
        </div>
      )
    }
  }

}

Vote.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
  showDownvote: PropTypes.bool,
};

Vote.defaultProps = {
  showDownvote: false
};

Vote.contextTypes = {
  intl: intlShape
};

registerComponent('Vote', Vote, withMessages, withVote);
