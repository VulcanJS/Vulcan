import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import { intlShape } from 'meteor/vulcan:i18n';
import { useMessages } from '../containers/withMessages.js';
import { useReactiveVar } from '@apollo/client';

const FlashMessages = ({ className }, { intl }) => {
  const { messagesState, ...flashActions } = useMessages(intl);
  const messages = useReactiveVar(messagesState.reactiveVar).messages;

  return (
    <div className={`flash-messages ${className}`}>
      {
        messages.map((message, i) =>
          <Components.Flash key={i} message={message} {...flashActions} />)
      }
    </div>
  );
};

FlashMessages.propTypes = {
  className: PropTypes.string,
};
FlashMessages.contextTypes = {
  intl: intlShape.isRequired,
};
FlashMessages.displayName = 'FlashMessages';

registerComponent('FlashMessages', FlashMessages);

export default FlashMessages;
