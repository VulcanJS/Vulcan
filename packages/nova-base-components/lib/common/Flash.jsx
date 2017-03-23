import { registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';

class Flash extends Component{

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
  message: React.PropTypes.object.isRequired
}

registerComponent('Flash', Flash);