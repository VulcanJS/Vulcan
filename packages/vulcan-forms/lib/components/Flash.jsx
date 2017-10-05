import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/lib/Alert'

const Flash = ({message, type}) => {
  
  type = type === "error" ? "danger" : type; // if type is "error", use "danger" instead

  return (
    <Alert className="flash-message" bsStyle={type}>
      {Array.isArray(message) ? 
        <ul>
          {message.map((message, index) => 
            <li key={index}>{message.content}</li>
          )}
        </ul>
        : <span>{message.content}</span>
      }
    </Alert>
  )
}

Flash.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object.isRequired, PropTypes.array.isRequired])
}

export default Flash;