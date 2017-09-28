import { Components, registerComponent, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withVote, hasVotedClient } from 'meteor/vulcan:voting';
import { intlShape } from 'meteor/vulcan:i18n';

class Reaction extends PureComponent {

  constructor() {
    super();
    this.vote = this.vote.bind(this);
    this.getActionClass = this.getActionClass.bind(this);
  }

  vote(voteType) {

    const document = this.props.document;
    const collection = this.props.collection;
    const user = this.props.currentUser;

    if(!user){
      this.props.flash(this.context.intl.formatMessage({id: 'users.please_log_in'}));
    } else {
      this.props.vote({document, voteType, collection, currentUser: this.props.currentUser});
    } 
  }

  getActionClass() {

    const document = this.props.document;
    
    const actionsClass = classNames(
      'vote-button',
      {'voted-happy': hasVotedClient({document, voteType: 'happy'})},
      {'voted-angry': hasVotedClient({document, voteType: 'angry'})},
      {'voted-sad': hasVotedClient({document, voteType: 'sad'})},
      {'voted-laughing': hasVotedClient({document, voteType: 'laughing'})},
    );

    return actionsClass;
  }

  render() {
    return (
      <div className={this.getActionClass()}>
        <a className="reaction-button button-happy" onClick={e => {e.preventDefault(); this.vote('happy')}}>😀</a>
        <a className="reaction-button button-angry" onClick={e => {e.preventDefault(); this.vote('angry')}}>😡</a>
        <a className="reaction-button button-sad" onClick={e => {e.preventDefault(); this.vote('sad')}}>😢</a>
        <a className="reaction-button button-laughing" onClick={e => {e.preventDefault(); this.vote('laughing')}}>😆</a>
      </div>
    )
  }

}

Reaction.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  vote: PropTypes.func.isRequired, // mutate function with callback inside
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
};

Reaction.contextTypes = {
  intl: intlShape
};

registerComponent('Reaction', Reaction, withMessages, withVote);
