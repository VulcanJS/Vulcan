import { Components, registerComponent } from 'meteor/vulcan:lib';
import { useDelete } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';

const DeleteButton = (
  {
    style = 'primary',
    variant,
    label,
    size,
    modalProps,
    component,
    document,
    documentId: _documentId,
    selector: _selector,
    collectionName,
    collection,
    fragmentName,
    ...props
  },
  { intl }
) => {
  const documentId = document ? document._id : _documentId;
  const selector = _selector || { _id: documentId };
  const [deleteFunc] = useDelete({ collectionName, collection, fragmentName });

  const DeleteConfirmation = props => (
    <div>
      <FormattedMessage id="datatable.deleteConfirmation" />
      <Components.Button
        size={size}
        variant={variant || style}
        onClick={async () => {
          await deleteFunc(selector);
          props.closeModal();
        }}>
        {label || <FormattedMessage id="datatable.delete" />}
      </Components.Button>
    </div>
  );

  return (
    <Components.ModalTrigger
      label={label || intl.formatMessage({ id: 'datatable.delete' })}
      component={
        component ? (
          component
        ) : (
          <Components.Button size={size} variant={variant || style}>
            {label || <FormattedMessage id="datatable.delete" />}
          </Components.Button>
        )
      }
      modalProps={modalProps}>
      <DeleteConfirmation />
    </Components.ModalTrigger>
  );
};

DeleteButton.contextTypes = {
  intl: intlShape,
};

DeleteButton.displayName = 'DeleteButton';

registerComponent('DeleteButton', DeleteButton);
