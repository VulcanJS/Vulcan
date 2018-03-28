import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const NewButton = ({ collection, size, style = 'primary', ...props }, { intl }) => (
  <Components.ModalTrigger
    label={intl.formatMessage({ id: 'datatable.new' })}
    component={
      <Button bsStyle={style} bsSize={size}>
        <FormattedMessage id="datatable.new" />
      </Button>
    }
  >
    <Components.NewForm collection={collection} {...props} />
  </Components.ModalTrigger>
);

NewButton.contextTypes = {
  intl: intlShape,
};

NewButton.displayName = 'NewButton';

registerComponent('NewButton', NewButton);

/*

NewForm Component

*/
const NewForm = ({ closeModal, successCallback, ...props }) => {

  const success = successCallback
    ? () => {
        successCallback();
        closeModal();
      }
    : closeModal;

  return <Components.SmartForm successCallback={success} {...props} />;
};
registerComponent('NewForm', NewForm);
