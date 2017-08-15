import { Components, replaceComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote, hasUpvoted, hasDownvoted } from 'meteor/vulcan:voting';
import { /*FormattedMessage,*/ intlShape } from 'meteor/vulcan:i18n';

import FontIcon from 'material-ui/FontIcon';

import UpvoteIcon from 'material-ui/svg-icons/navigation/expand-less';
import DownvoteIcon from 'material-ui/svg-icons/navigation/expand-more';

class Vote extends PureComponent {

  constructor() {
    super();
    this.upvote = this.upvote.bind(this);
    this.downvote = this.downvote.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
    // this.startLoading = this.startLoading.bind(this);
    // this.stopLoading = this.stopLoading.bind(this);
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
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
      // this.stopLoading();
    } else {
      const voteType = hasUpvoted(user, document) ? "cancelUpvote" : "upvote";
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser}).then(result => {
        // this.stopLoading();
      });
    }
  }

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

  getActionClass() {
    const document = this.props.document;
    const user = this.props.currentUser;

    const isUpvoted = hasUpvoted(user, document);
    const isDownvoted = hasDownvoted(user, document);
    const actionsClass = classNames(
      'vote',
      {voted: isUpvoted || isDownvoted},
      {upvoted: isUpvoted},
      {downvoted: isDownvoted}
    );

    return actionsClass;
  }

  render() {
    return (
      <div className={this.getActionClass()}>
        <div className="vote-count">{this.props.document.baseScore || 0} <span className="vote-count-text">points</span></div>
        <a className="upvote-button" onClick={this.upvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <FontIcon className="material-icons">expand_less</FontIcon> }
            <div className="sr-only">Upvote</div>
        </a>
        <a className="downvote-button" onClick={this.downvote}>
            {this.state.loading ? <Components.Icon name="spinner" /> : <FontIcon className="material-icons">expand_more</FontIcon> }
            <div className="sr-only">Downvote</div>
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

Vote.contextTypes = {
  intl: intlShape
};

replaceComponent('Vote', Vote, withMessages, withVote);
