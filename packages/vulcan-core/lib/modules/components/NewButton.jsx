import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const NewButton = ({ collection, size, style = 'primary', ...props }, { intl }) => (
  <Components.ModalTrigger
    label={intl.formatMessage({ id: 'datatable.new' })}
    component={
      <Components.Button variant={style} size={size}>
        <FormattedMessage id="datatable.new" />
      </Components.Button>
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
    ? document => {
        successCallback(document);
        closeModal();
      }
    : closeModal;

  return <Components.SmartForm successCallback={success} {...props} />;
};
registerComponent('NewForm', NewForm);
