import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const NewButton = ({ collection, bsStyle = 'primary', ...props }, {intl}) =>
  <Components.ModalTrigger 
    label={intl.formatMessage({id: 'datatable.new'})} 
    component={<Button bsStyle={bsStyle}><FormattedMessage id="datatable.new" /></Button>}
  >
    <Components.DatatableNewForm collection={collection} {...props} />
  </Components.ModalTrigger>

NewButton.contextTypes = {
  intl: intlShape
};

NewButton.displayName = 'NewButton';

registerComponent('NewButton', NewButton);