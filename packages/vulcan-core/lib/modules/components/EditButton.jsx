import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const EditButton = ({ style = 'primary', size, ...props }, {intl}) =>
  <Components.ModalTrigger 
    label={intl.formatMessage({id: 'datatable.edit'})} 
    component={<Button bsSize={size} bsStyle={style}><FormattedMessage id="datatable.edit" /></Button>}
  >
    <Components.EditForm {...props} />
  </Components.ModalTrigger>

EditButton.contextTypes = {
  intl: intlShape
};

EditButton.displayName = 'EditButton';

registerComponent('EditButton', EditButton);

/*

EditForm Component

*/
const EditForm = ({ closeModal, ...props }) =>
  <Components.SmartForm
    successCallback={document => {
      closeModal();
    }}
    removeSuccessCallback={document => {
      closeModal();
    }}
    {...props}
  />
registerComponent('EditForm', EditForm);
