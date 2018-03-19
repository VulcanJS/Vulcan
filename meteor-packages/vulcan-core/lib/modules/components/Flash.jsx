import { Components, registerComponent } from 'meteor/vulcan:lib';
import withMessages from '../containers/withMessages.js';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert'

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

  render() {

    let flashType = this.props.message.flashType;
    flashType = flashType === "error" ? "danger" : flashType; // if flashType is "error", use "danger" instead

    return (
      <Alert className="flash-message" bsStyle={flashType} onDismiss={this.dismissFlash}>
        {this.props.message.content}
      </Alert>
    )
  }
}

Flash.propTypes = {
  message: PropTypes.object.isRequired
}

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

FlashMessages.displayName = "FlashMessages";

registerComponent('FlashMessages', FlashMessages, withMessages);

export default withMessages(FlashMessages);