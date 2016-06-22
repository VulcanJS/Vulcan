import React, { PropTypes, Component } from 'react';
import { Alert } from 'react-bootstrap';

const Flash = ({message}) => {
  
  let type = message.type;
  type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead

  return (
    <Alert className="flash-message" bsStyle={type}>
      {message.content}
    </Alert>
  )
}

Flash.propTypes = {
  message: React.PropTypes.object.isRequired
}

export default Flash;