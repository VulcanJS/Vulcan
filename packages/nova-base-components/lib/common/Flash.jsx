import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';
//import { Messages } from "meteor/nova:core";

class Flash extends Component{

  constructor() {
    super();
    this.dismissFlash = this.dismissFlash.bind(this);
  }

  componentDidMount() {
    this.context.messages.markAsSeen(this.props.message._id);
  }

  dismissFlash(e) {
    e.preventDefault();
    this.context.messages.clear(this.props.message._id);
  }

  render() {

    let type = this.props.message.type;
    type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead

    return (
      <Alert className="flash-message" bsStyle={type} onDismiss={this.dismissFlash}>
        {this.props.message.content}
      </Alert>
    )
  }
}

Flash.propTypes = {
  message: React.PropTypes.object.isRequired
}

Flash.contextTypes = {
  messages: React.PropTypes.object.isRequired
}

module.exports = Flash;