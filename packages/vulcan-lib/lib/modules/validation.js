import pickBy from 'lodash/pickBy';
import mapValues from 'lodash/mapValues';
import { forEachDocumentField } from './schema_utils';

export const dataToModifier = data => ({
  $set: pickBy(data, f => f !== null),
  $unset: mapValues(pickBy(data, f => f === null), () => true),
});

export const modifierToData = modifier => ({
  ...modifier.$set,
  ...mapValues(modifier.$unset, () => null),
});



/**
 * Validate a document permission recursively
 * @param {*} fullDocument (must not be partial since permission logic may rely on full document)
 * @param {*} documentToValidate document to validate
 * @param {*} schema Simple schema
 * @param {*} context Current user and Users collectionœ
 * @param {*} mode create or update
 * @param {*} currentPath current path for recursive calls (nested, nested[0].foo, ...)
 */
const validateDocumentPermissions = (fullDocument, documentToValidate, schema, context, mode = 'create', currentPath = '') => {
  let validationErrors = [];
  const { Users, currentUser } = context;
  forEachDocumentField(documentToValidate, schema,
    ({ fieldName, fieldSchema, currentPath, isNested }) => {
      if (isNested && (!fieldSchema || (mode === 'create' ? !fieldSchema.canCreate : !fieldSchema.canUpdate))) return; // ignore nested without permission
      if (!fieldSchema
        || (mode === 'create' ? !Users.canCreateField(currentUser, fieldSchema) : !Users.canUpdateField(currentUser, fieldSchema, fullDocument))
      ) {
        validationErrors.push({
          id: 'errors.disallowed_property_detected',
          properties: {
            name: `${currentPath}${fieldName}`
          },
        });
      }
    });
  return validationErrors;
};
/*

  If document is not trusted, run validation steps:

  1. Check that the current user has permission to edit each field
  2. Run SimpleSchema validation step

*/
export const validateDocument = (document, collection, context, validationContextName = 'defaultContext') => {
  const schema = collection.simpleSchema()._schema;

  let validationErrors = [];

  // validate creation permissions (and other Vulcan-specific constraints)
  validationErrors = validationErrors.concat(
    validateDocumentPermissions(document, document, schema, context, 'create')
  );

  // run simple schema validation (will check the actual types, required fields, etc....)
  const validationContext = collection.simpleSchema().namedContext(validationContextName);
  validationContext.validate(document);

  if (!validationContext.isValid()) {
    const errors = validationContext.validationErrors();
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      // console.log(error);
      if (error.type.includes('intlError')) {
        const intlError = JSON.parse(error.type.replace('intlError|', ''));
        validationErrors = validationErrors.concat(intlError);
      } else {
        validationErrors.push({
          id: `errors.${error.type}`,
          path: error.name,
          properties: {
            collectionName: collection.options.collectionName,
            typeName: collection.options.typeName,
            ...error,
          },
        });
      }
    });
  }

  return validationErrors;
};

/*

  If document is not trusted, run validation steps:

  1. Check that the current user has permission to insert each field
  2. Run SimpleSchema validation step

*/
export const validateModifier = (modifier, data, document, collection, context, validationContextName = 'defaultContext') => {
  const schema = collection.simpleSchema()._schema;
  const set = modifier.$set;
  const unset = modifier.$unset;

  let validationErrors = [];

  // 1. check that the current user has permission to edit each field
  validationErrors = validationErrors.concat(
    validateDocumentPermissions(document, data, schema, context, 'update')
  );

  // 2. run SS validation
  const validationContext = collection.simpleSchema().namedContext(validationContextName);
  validationContext.validate({ $set: set, $unset: unset }, { modifier: true, extendedCustomContext: { documentId: document._id } });

  if (!validationContext.isValid()) {
    const errors = validationContext.validationErrors();
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      // console.log(error);
      if (error.type.includes('intlError')) {
        validationErrors = validationErrors.concat(JSON.parse(error.type.replace('intlError|', '')));
      } else {
        validationErrors.push({
          id: `errors.${error.type}`,
          path: error.name,
          properties: {
            collectionName: collection.options.collectionName,
            typeName: collection.options.typeName,
            ...error,
          },
        });
      }
    });
  }

  return validationErrors;
};

export const validateData = (data, document, collection, context) => {
  return validateModifier(dataToModifier(data), data, document, collection, context);
};

/*

The following versions were written to be more SimpleSchema-agnostic, but
are not currently used

*/

/*

  If document is not trusted, run validation steps:

  1. Check that the current user has permission to edit each field
  2. Check field lengths
  3. Check field types
  4. Check for missing fields
  5. Run SimpleSchema validation step (for now)

*/
export const validateDocumentNotUsed = (document, collection, context) => {
  const { Users, currentUser } = context;
  const schema = collection.simpleSchema()._schema;

  let validationErrors = [];

  // Check validity of inserted document
  _.forEach(document, (value, fieldName) => {
    const fieldSchema = schema[fieldName];

    // 1. check that the current user has permission to insert each field
    if (!fieldSchema || !Users.canCreateField(currentUser, fieldSchema)) {
      validationErrors.push({
        id: 'app.disallowed_property_detected',
        fieldName,
      });
    }

    // 2. check field lengths
    if (fieldSchema.limit && value.length > fieldSchema.limit) {
      validationErrors.push({
        id: 'app.field_is_too_long',
        data: { fieldName, limit: fieldSchema.limit },
      });
    }

    // 3. check that fields have the proper type
    // TODO
  });

  // 4. check that required fields have a value
  _.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];

    if ((fieldSchema.required || !fieldSchema.optional) && typeof document[fieldName] === 'undefined') {
      validationErrors.push({
        id: 'app.required_field_missing',
        data: { fieldName },
      });
    }
  });

  // 5. still run SS validation for now for backwards compatibility
  try {
    collection.simpleSchema().validate(document);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    validationErrors.push({
      id: 'app.schema_validation_error',
      data: { message: error.message },
    });
  }

  return validationErrors;
};

/*

  If document is not trusted, run validation steps:

  1. Check that the current user has permission to insert each field
  2. Check field lengths
  3. Check field types
  4. Check for missing fields
  5. Run SimpleSchema validation step (for now)

*/
export const validateModifierNotUsed = (modifier, document, collection, context) => {
  const { Users, currentUser } = context;
  const schema = collection.simpleSchema()._schema;
  const set = modifier.$set;
  const unset = modifier.$unset;

  let validationErrors = [];

  // 1. check that the current user has permission to edit each field
  const modifiedProperties = _.keys(set).concat(_.keys(unset));
  modifiedProperties.forEach(function (fieldName) {
    var field = schema[fieldName];
    if (!field || !Users.canUpdateField(currentUser, field, document)) {
      validationErrors.push({
        id: 'app.disallowed_property_detected',
        data: { name: fieldName },
      });
    }
  });

  // Check validity of set modifier
  _.forEach(set, (value, fieldName) => {
    const fieldSchema = schema[fieldName];

    // 2. check field lengths
    if (fieldSchema.limit && value.length > fieldSchema.limit) {
      validationErrors.push({
        id: 'app.field_is_too_long',
        data: { name: fieldName, limit: fieldSchema.limit },
      });
    }

    // 3. check that fields have the proper type
    // TODO
  });

  // 4. check that required fields have a value
  // when editing, we only want to require fields that are actually part of the form
  // so we make sure required keys are present in the $unset object
  _.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];

    if (unset[fieldName] && (fieldSchema.required || !fieldSchema.optional) && typeof set[fieldName] === 'undefined') {
      validationErrors.push({
        id: 'app.required_field_missing',
        data: { name: fieldName },
      });
    }
  });

  // 5. still run SS validation for now for backwards compatibility
  const validationContext = collection.simpleSchema().newContext();
  validationContext.validate({ $set: set, $unset: unset }, { modifier: true });

  if (!validationContext.isValid()) {
    const errors = validationContext.validationErrors();
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      // console.log(error);
      validationErrors.push({
        id: 'app.schema_validation_error',
        data: error,
      });
    });
  }

  return validationErrors;
};
