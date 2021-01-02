import {Components, registerComponent} from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'meteor/vulcan:i18n';

const Flash = (props) => {
  const {message, type} = props.message;

  const dismissFlash = (e) => {
    e.preventDefault();
    props.dismissFlash(props.message._id);
  };

  return (
      <Components.Alert className="flash-message"
                        variant={type}
                        onClose={dismissFlash}>
        <span dangerouslySetInnerHTML={{__html: message}}/>
      </Components.Alert>
  );
};

Flash.propTypes = {
  message: PropTypes.object.isRequired,
  dismissFlash: PropTypes.func.isRequired,
};

Flash.contextTypes = {
  intl: intlShape
};

registerComponent('Flash', Flash);

export default Flash;
