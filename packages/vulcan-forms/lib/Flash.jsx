import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert'

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
  message: PropTypes.object.isRequired
}

export default Flash;