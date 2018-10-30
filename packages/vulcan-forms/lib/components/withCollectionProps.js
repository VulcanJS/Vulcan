import React from 'react';
import { extractCollectionInfo } from 'meteor/vulcan:lib';
import PropTypes from 'prop-types';

/**
 * Handle the collection or collectionName and pass down other related
 * props (typeName, collectionName, etc.)
 */
const withCollectionProps = C => {
  const CollectionPropsWrapper = ({ collection: _collection, collectionName: _collectionName, ...otherProps }) => {
    const { collection, collectionName } = extractCollectionInfo({
      collection: _collection,
      collectionName: _collectionName
    });
    const typeName = collection.options.typeName;
    return <C {...otherProps} collection={collection} collectionName={collectionName} typeName={typeName} />;
  };
  CollectionPropsWrapper.propTypes = {
    collection: PropTypes.object,
    collectionName: (props, propName, componentName) => {
      if (!props.collection && !props.collectionName) {
        return new Error(`One of props 'collection' or 'collectionName' was not specified in '${componentName}'.`);
      }
      if (!props.collection && typeof props['collectionName'] !== 'string') {
        return new Error(`Prop collectionName was not of type string in '${componentName}`);
      }
    }
  };
  return CollectionPropsWrapper;
};
export default withCollectionProps;
