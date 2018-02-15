import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const EditButton = ({ collection, document, bsStyle = 'primary', ...props }, {intl}) =>
  <Components.ModalTrigger 
    label={intl.formatMessage({id: 'datatable.edit'})} 
    component={<Button bsStyle={bsStyle}><FormattedMessage id="datatable.edit" /></Button>}
  >
    <Components.EditForm collection={collection} document={document} {...props} />
  </Components.ModalTrigger>

EditButton.contextTypes = {
  intl: intlShape
};

EditButton.displayName = 'EditButton';

registerComponent('EditButton', EditButton);

/*

EditForm Component

*/
const EditForm = ({ collection, document, closeModal, options, ...props }) =>
  <Components.SmartForm
    {...props}
    collection={collection}
    documentId={document._id}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
    removeSuccessCallback={document => {
      closeModal();
    }}
  />
registerComponent('EditForm', EditForm);
