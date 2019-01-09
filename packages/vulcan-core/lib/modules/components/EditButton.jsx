import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const EditButton = ({ style = 'primary', size, showId, modalProps, ...props }, { intl }) => (
  <Components.ModalTrigger
    label={intl.formatMessage({ id: 'datatable.edit' })}
    component={
      <Components.Button size={size} variant={style}>
        <FormattedMessage id="datatable.edit" />
      </Components.Button>
    }
    modalProps={modalProps}
  >
    <Components.EditForm {...props} />
  </Components.ModalTrigger>
);

EditButton.contextTypes = {
  intl: intlShape,
};

EditButton.displayName = 'EditButton';

registerComponent('EditButton', EditButton);

/*

EditForm Component

*/
const EditForm = ({ closeModal, successCallback, removeSuccessCallback, ...props }) => {

  const success = successCallback
    ? document => {
        successCallback(document);
        closeModal();
      }
    : closeModal;

  const remove = removeSuccessCallback
    ? document => {
        removeSuccessCallback(document);
        closeModal();
      }
    : closeModal;

  return (
    <Components.SmartForm successCallback={success} removeSuccessCallback={remove} {...props} />
  );
};
registerComponent('EditForm', EditForm);
