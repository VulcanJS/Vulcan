import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { intlShape } from 'meteor/vulcan:i18n';

const NewButton = ({ collection, size, label, style = 'primary', formProps, ...props }, { intl }) => (
  <Components.ModalTrigger
    label={label || intl.formatMessage({ id: 'datatable.new' })}
    title={label || intl.formatMessage({ id: 'datatable.new' })}
    component={
      <Components.Button variant={style} size={size}>
       {label || <Components.FormattedMessage id="datatable.new" />}
      </Components.Button>
    }
  >
    <Components.NewForm collection={collection} formProps={formProps} {...props} />
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
const NewForm = ({ closeModal, successCallback, formProps, ...props }) => {

  const success = successCallback
    ? document => {
        successCallback(document);
        closeModal();
      }
    : () => {
         closeModal();
      };

  return <Components.SmartForm successCallback={success} {...formProps} {...props} />;
};
registerComponent('NewForm', NewForm);
