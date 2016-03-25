import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';

import Core from "meteor/nova:core";
const Messages = Core.Messages;

class Flash extends Component{

  componentDidMount() {
    Messages.markAsSeen(this.props.message._id);
  }

  render() {

    let type = this.props.message.type;
    type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead

    return (
      <Alert className="flash-message" bsStyle={type}>
        {this.props.message.content}
      </Alert>
    )
  }
}

module.exports = Flash;