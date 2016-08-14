import React, { PropTypes, Component } from 'react';
import { intlShape } from 'react-intl';
import Telescope from 'meteor/nova:lib';

class SubscribeTo extends Component {

  constructor(props, context) {
    super(props, context);

    this.onSubscribe = this.onSubscribe.bind(this);
    this.isSubscribed = this.isSubscribed.bind(this);
  }

  onSubscribe(e) {
    e.preventDefault();

    const {document, documentType} = this.props;

    const action = this.isSubscribed() ? `${this.props.documentType}.unsubscribe` : `${this.props.documentType}.subscribe`;

    this.context.actions.call(action, this.props.document._id, (error, result) => {
      if (error)
        this.context.messages.flash(error.message, "error")
      if (result)
        this.context.events.track(action, {'_id': this.props.document._id});
    });
  }

  isSubscribed() {
    // if the document is a user, the subscribers object is located on `user.telescope`
    const documentCheck = this.props.documentType === 'users' ? this.props.document.telescope : this.props.document;

    return documentCheck && documentCheck.subscribers && documentCheck.subscribers.indexOf(this.context.currentUser._id) !== -1;
  }

  render() {
    const {document, documentType} = this.props;
    const {currentUser, intl} = this.context;

    // can't subscribe to yourself or to own post (also validated on server side)
    if (!currentUser || !document || (documentType === 'posts' && document && document.author === currentUser.username) || (documentType === 'users' && document === currentUser)) {
      return null;
    }

    const action = this.isSubscribed() ? `${documentType}.unsubscribe` : `${documentType}.subscribe`;

    return (
      <Telescope.components.CanDo action={action}>
        <a onClick={this.onSubscribe}>{intl.formatMessage({id: action})}</a>
      </Telescope.components.CanDo>
    );
  }

}

SubscribeTo.propTypes = {
  document: React.PropTypes.object.isRequired,
  documentType: React.PropTypes.string.isRequired,
}

SubscribeTo.contextTypes = {
  currentUser: React.PropTypes.object,
  messages: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  intl: intlShape
};

export default SubscribeTo;
