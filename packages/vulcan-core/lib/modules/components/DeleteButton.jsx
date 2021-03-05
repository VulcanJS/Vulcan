import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { useDelete } from '../containers/delete';

const DeleteButton = props => {
  const { label, collection, collectionName, fragment, fragmentName, documentId, mutationOptions, currentUser, ...rest } = props;
  const [deleteFunction, { loading }] = useDelete({
    collection,
    collectionName,
    fragment,
    fragmentName,
    mutationOptions,
  });

  return (
    <Components.LoadingButton
      loading={loading}
      onClick={() => {
        deleteFunction({ input: { id: documentId } });
      }}
      label={label || <Components.FormattedMessage id="datatable.delete" defaultMessage="Delete" />}
      {...rest}
    />
  );
};

registerComponent('DeleteButton', DeleteButton);
