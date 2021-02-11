/**
 * Generates the default fragment for a collection
 * = a fragment containing all fields
 */
import { getFragmentFieldNames, createSchema } from '../schema_utils';
import { isBlackbox } from '../simpleSchema_utils';
import { registerFragment } from '../fragments.js';


const intlSuffix = '_intl';

// get fragment for a whole object (root schema or nested schema of an object or an array)
export const getObjectFragment = ({
  schema,
  fragmentName,
  options,
}) => {
  const fieldNames = getFragmentFieldNames({ schema, options });
  const childFragments = fieldNames.length && fieldNames.map(fieldName => getFieldFragment({
    schema,
    fieldName,
    options,
    getObjectFragment: getObjectFragment,
  }))
  // remove empty values
  .filter(f => !!f);
  if (childFragments.length) {
    return `${fragmentName} { ${childFragments.join('\n')} }`;
  }
  return null;
};

// get fragment for a specific field (either the field name or a nested fragment)
export const getFieldFragment = ({
  schema,
  fieldName,
  options,
  getObjectFragment = getObjectFragment, // a callback to call on nested schema
}) => {
  // intl
  if (fieldName.slice(-5) === intlSuffix) {
    return `${fieldName}{ locale value }`;
  }
  if (fieldName === '_id') return fieldName;
  const field = schema[fieldName];

  const fieldType = field.type.singleType;
  const fieldTypeName =
    typeof fieldType === 'object' ? 'Object' : typeof fieldType === 'function' ? fieldType.name : fieldType;

  switch (fieldTypeName) {
    case 'Object':
      if (!isBlackbox(field) && fieldType._schema) {
        return getObjectFragment({
          fragmentName: fieldName,
          schema: fieldType._schema,
          options,
        }) || null;
      }
      return fieldName;
    case 'Array':
      const arrayItemFieldName = `${fieldName}.$`;
      const arrayItemField = schema[arrayItemFieldName];
      // note: make sure field has an associated array item field
      if (arrayItemField) {
        // child will either be native value or a an object (first case)
        const arrayItemFieldType = arrayItemField.type.singleType;
        if (!isBlackbox(field) && arrayItemFieldType._schema) {
          return getObjectFragment({
            fragmentName: fieldName,
            schema: arrayItemFieldType._schema,
            options,
          }) || null;
        }
      }
      return fieldName;
    default:
      return fieldName; // fragment = fieldName
  }
};


/*

Create default "dumb" gql fragment object for a given collection

*/
export const getDefaultFragmentText = (collection, options = { onlyViewable: true }) => {
  const schema = collection.simpleSchema()._schema;
  return getObjectFragment({
    schema,
    fragmentName: `fragment ${collection.options.collectionName}DefaultFragment on ${collection.typeName}`,
    options,
  }) || null;
};

export default getDefaultFragmentText;


/**
 * Generates and registers a default fragment for a typeName registered using `registerCustomQuery()`
 * @param {string} typeName The GraphQL Type registered using `registerCustomQuery()`
 * @param {Object|SimpleSchema} [schema] Schema definition object to convert to a fragment
 * @param {String} [fragmentName] The fragment's name; if omitted `${typeName}DefaultFragment` will be used
 * @param {[String]} [defaultCanRead] Fields in the schema without `canRead` will be assigned these read permissions
 * @param {Object} options Options sent to `getObjectFragment()`
 */
export const registerCustomDefaultFragment = function ({
                                                         typeName,
                                                         schema,
                                                         fragmentName,
                                                         defaultCanRead,
                                                         options = { onlyViewable: true },
                                                       }) {
  const simpleSchema = createSchema(schema, undefined, undefined, defaultCanRead);
  schema = simpleSchema._schema;

  fragmentName = fragmentName || `${typeName}DefaultFragment`;

  const defaultFragment = getObjectFragment({
    schema,
    fragmentName: `fragment ${fragmentName} on ${typeName}`,
    options,
  });

  if (defaultFragment) registerFragment(defaultFragment);
};
