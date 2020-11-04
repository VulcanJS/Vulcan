import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { useDelete2 } from '../containers/delete2';

const DeleteButton = (props) => {
  const { label, collection, collectionName, fragment, fragmentName, documentId, mutationOptions, ...rest } = props;
  const [deleteFunction, { loading }] = useDelete2({
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
      label={label || <FormattedMessage id="datatable.delete" defaultMessage="Delete" />}
      {...rest}
    />
  );
};

registerComponent('DeleteButton', DeleteButton);
