import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const EditButton = ({ collection, document, bsStyle = 'primary' }, {intl}) =>
  <Components.ModalTrigger 
    label={intl.formatMessage({id: 'datatable.edit'})} 
    component={<Button bsStyle={bsStyle}><FormattedMessage id="datatable.edit" /></Button>}
  >
    <Components.DatatableEditForm collection={collection} document={document} />
  </Components.ModalTrigger>

EditButton.contextTypes = {
  intl: intlShape
};

EditButton.displayName = 'EditButton';

registerComponent('EditButton', EditButton);