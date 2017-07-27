import { Components, replaceComponent, withMessages } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

class FlashMessages extends Component {
  handleRequestClose = () => {
    let message = this.props.messages.filter(message => message.show)[0];
    this.setState({
      open: false,
    });
    if(message) {
      this.props.markAsSeen(message._id);
      this.props.clear(message._id);
    }
  };

  render() {
    let messages = this.props.messages.filter(message => message.show);
    return (
      <div className="flash-messages">
        <Snackbar
          open={messages.length > 0}
          message={messages.length > 0 && messages[0].content}
          autoHideDuration = {4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }

}

FlashMessages.displayName = "FlashMessages";

replaceComponent('FlashMessages', FlashMessages, withMessages);
