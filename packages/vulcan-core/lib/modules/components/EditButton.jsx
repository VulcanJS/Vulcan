import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const EditButton = ({ style = 'primary', label, size, showId, modalProps, formProps, ...props }, { intl }) => (
  <Components.ModalTrigger
    label={label || intl.formatMessage({ id: 'datatable.edit' })}
    component={
      <Components.Button size={size} variant={style}>
        {label || <FormattedMessage id="datatable.edit" />}
      </Components.Button>
    }
    modalProps={modalProps}
  >
    <Components.EditForm {...props} formProps={formProps}/>
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
const EditForm = ({ closeModal, successCallback, removeSuccessCallback, formProps, ...props }) => {

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
    <Components.SmartForm successCallback={success} removeSuccessCallback={remove} {...formProps} {...props} />
  );
};
registerComponent('EditForm', EditForm);
