import { Components } from 'meteor/vulcan:lib';
import { useDelete2, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import Delete from 'mdi-material-ui/Delete';

const DeleteButton = (
  {
    style = 'primary',
    color = 'default',
    variant,
    label,
    size,
    buttonClasses,
    triggerClasses,
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
      classes={triggerClasses}
      component={
        component ? (
          component
        ) : (
          <Components.TooltipButton
            titleId="datatable.delete"
            icon={<Delete />}
            color={color}
            label={label}
            variant={variant || style}
            classes={buttonClasses}
          />
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

replaceComponent('DeleteButton', DeleteButton);
