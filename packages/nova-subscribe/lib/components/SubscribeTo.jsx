import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import { withCurrentUser, withMessages, registerComponent } from 'meteor/nova:core';

class SubscribeTo extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  onSubscribe(e) {
    e.preventDefault();

    const {document, documentType} = this.props;

    const action = this.isSubscribed() ? `unsubscribe` : `subscribe`;

    // method name will be for example posts.subscribe
    this.context.actions.call(`${documentType}.${action}`, document._id, (error, result) => {
      if (error) {
        this.props.flash(error.message, "error");
      }

      if (result) {
        // success message will be for example posts.subscribed
        this.props.flash(this.context.intl.formatMessage(
          {id: `${documentType}.${action}d`}, 
          // handle usual name properties
          {name: document.name || document.title || document.displayName}
        ), "success");
        this.context.events.track(action, {'_id': this.props.document._id});
      }
    });
  }

  isSubscribed() {
    const documentCheck = this.props.document;

    return documentCheck && documentCheck.subscribers && documentCheck.subscribers.indexOf(this.context.currentUser._id) !== -1;
  }

  render() {
    const {currentUser, document, documentType} = this.props;

    // can't subscribe to yourself or to own post (also validated on server side)
    if (!currentUser || !document || (documentType === 'posts' && document && document.author === currentUser.username) || (documentType === 'users' && document === currentUser)) {
      return null;
    }

    const action = this.isSubscribed() ? `${documentType}.unsubscribe` : `${documentType}.subscribe`;

    const className = this.props.className ? this.props.className : "";

    return Users.canDo(currentUser, action) ? <a className={className} onClick={this.onSubscribe}>{this.context.intl.formatMessage({id: action})}</a> : null;
  }

}

SubscribeTo.propTypes = {
  document: React.PropTypes.object.isRequired,
  documentType: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  currentUser: React.PropTypes.object,
}

SubscribeTo.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
};

registerComponent('SubscribeTo', SubscribeTo, withCurrentUser, withMessages);