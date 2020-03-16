import { Components, registerComponent } from 'meteor/vulcan:lib';
import { useDelete2 } from 'meteor/vulcan:core';
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
    documentIds: _documentIds,
    input: _input,
    collectionName,
    collection,
    fragmentName,
    ...props
  },
  { intl }
) => {
  const documentId = document ? document._id : _documentId;
  const documentIds = _documentIds || [documentId];
  //TODO : accept input when delete2 can delete >1 docs
  //const input = _input || { id: documentId };
  const [deleteFunc] = useDelete2({ collectionName, collection, fragmentName });
  const DeleteConfirmation = props => (
    <div>
      <FormattedMessage id="datatable.deleteConfirmation" />
      <Components.Button
        size={size}
        variant={variant || style}
        onClick={async () => {
          //TODO : accept input when delete2 can delete >1 docs
          //await deleteFunc({ input });
          documentIds.forEach(async id => {
            await deleteFunc({ input: { id } });
          });
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
