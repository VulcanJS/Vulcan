/**
 * Get the documentId from parent props or from the route
 */
import React from 'react';
export const withDocumentId = (fieldName = 'documentId') => Component => {
  const withDocumentId = props => (
    <Component
      documentId={props[fieldName] || (props.params && props.params[fieldName]) || undefined}
      {...props}
    />
  );
  withDocumentId.displayName = `withDocumentId(${Component.displayName})`;
  return withDocumentId;
};
export default withDocumentId;
