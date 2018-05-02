import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMessages from '../containers/withMessages.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

class Flash extends PureComponent {

  constructor() {
    super();
    this.dismissFlash = this.dismissFlash.bind(this);
  }

  componentDidMount() {
    this.props.markAsSeen(this.props.message._id);
  }

  dismissFlash(e) {
    e.preventDefault();
    this.props.clear(this.props.message._id);
  }

  getProperties = () => {
    const messageObject = this.props.message;
    if (typeof messageObject === 'string') {
      // if error is a string, use it as message
      return {
        message: messageObject,
        type: 'error'
      }
    } else {
      // else return full error object after internationalizing message
      const { id, message, properties } = messageObject;
      const translatedMessage = this.context.intl.formatMessage({ id, defaultMessage: message }, properties);
      return {
        ...messageObject,
        message: translatedMessage,
      };
    }
  }

  render() {

    const { message, type } = this.getProperties();
    const flashType = type === 'error' ? 'danger' : type; // if flashType is "error", use "danger" instead

    return (
      <Components.Alert className="flash-message" variant={flashType} onDismiss={this.dismissFlash}>
        {message}
      </Components.Alert>
    )
  }
}

Flash.propTypes = {
  message: PropTypes.object.isRequired
}

Flash.contextTypes = {
  intl: intlShape
};

registerComponent('Flash', Flash);

const FlashMessages = ({messages, clear, markAsSeen}) => {
  return (
    <div className="flash-messages">
      {messages
        .filter(message => message.show)
        .map(message => <Components.Flash key={message._id} message={message} clear={clear} markAsSeen={markAsSeen} />)}
    </div>
  );
}

FlashMessages.displayName = 'FlashMessages';

registerComponent('FlashMessages', FlashMessages, withMessages);

export default withMessages(FlashMessages);
