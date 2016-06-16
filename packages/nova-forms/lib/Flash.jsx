import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';

const Flash = () => {
  
  let type = this.props.message.type;
  type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead

  return (
    <Alert className="flash-message" bsStyle={type}>
      {this.props.message.content}
    </Alert>
  )
}

Flash.propTypes = {
  message: React.PropTypes.object.isRequired
}

export default Flash;