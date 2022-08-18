import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';

const EditButton = (
  { style = 'primary', variant, label, size, showId, modalProps, formProps, component, mutationFragmentName, ...props },
  { intl }
) => (
  <Components.ModalTrigger
    label={label || intl.formatMessage({ id: 'datatable.edit', defaultMessage: 'Edit' })}
    component={
      component ? (
        component
      ) : (
        <Components.Button size={size} variant={variant || style}>
          {label || <Components.FormattedMessage id="datatable.edit" defaultMessage="Edit" />}
        </Components.Button>
      )
    }
    modalProps={modalProps}>
    <Components.EditForm {...props} formProps={{ mutationFragmentName, ...formProps }} />
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
const EditForm = props => {
  const { closeModal, successCallback, removeSuccessCallback, formProps, ...rest } = props;
  const success = successCallback
    ? document => {
        successCallback(document);
        closeModal();
      }
    : () => {
        closeModal();
      };

  const remove = removeSuccessCallback
    ? document => {
        removeSuccessCallback(document);
        closeModal();
      }
    : () => {
        closeModal();
      };

  return <Components.SmartForm successCallback={success} removeSuccessCallback={remove} {...formProps} {...rest} />;
};
registerComponent('EditForm', EditForm);
