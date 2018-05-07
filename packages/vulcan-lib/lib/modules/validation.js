/*

  If document is not trusted, run validation steps:

  1. Check that the current user has permission to edit each field
  2. Check field lengths
  3. Check field types
  4. Check for missing fields
  5. Run SimpleSchema validation step (for now)

*/
export const validateDocument = (document, collection, context) => {
  const { Users, currentUser } = context;
  const schema = collection.simpleSchema()._schema;

  let validationErrors = [];

  // Check validity of inserted document
  _.forEach(document, (value, fieldName) => {
    const fieldSchema = schema[fieldName];

    // 1. check that the current user has permission to insert each field
    if (!fieldSchema || !Users.canInsertField(currentUser, fieldSchema)) {
      validationErrors.push({
        id: 'errors.disallowed_property_detected',
        properties: { name: fieldName },
      });
    }

    // 2. check field lengths
    // if (fieldSchema.limit && value.length > fieldSchema.limit) {
    //   validationErrors.push({
    //     id: 'errors.field_is_too_long',
    //     data: { fieldName, limit: fieldSchema.limit },
    //   });
    // }

    // 3. check that fields have the proper type
    // TODO
  });

  // 4. check that required fields have a value
  // _.keys(schema).forEach(fieldName => {
  //   const fieldSchema = schema[fieldName];

  //   if ((fieldSchema.required || !fieldSchema.optional) && typeof document[fieldName] === 'undefined') {
  //     validationErrors.push({
  //       id: 'app.required_field_missing',
  //       data: { fieldName },
  //     });
  //   }
  // });

  // 5. still run SS validation for now for backwards compatibility
  const validationContext = collection.simpleSchema().newContext();
  validationContext.validate(document);

  if (!validationContext.isValid()) {
    const errors = validationContext.validationErrors();
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      // console.log(error);
      validationErrors.push({
        id: `errors.${error.type}`,
        path: error.name,
        properties: error,
      });
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
export const validateModifier = (modifier, document, collection, context) => {
  const { Users, currentUser } = context;
  const schema = collection.simpleSchema()._schema;
  const set = modifier.$set;
  const unset = modifier.$unset;

  let validationErrors = [];

  // 1. check that the current user has permission to edit each field
  const modifiedProperties = _.keys(set).concat(_.keys(unset));
  modifiedProperties.forEach(function(fieldName) {
    var field = schema[fieldName];
    if (!field || !Users.canEditField(currentUser, field, document)) {
      validationErrors.push({
        id: 'errors.disallowed_property_detected',
        properties: { name: fieldName },
      });
    }
  });

  // Check validity of set modifier
  // _.forEach(set, (value, fieldName) => {
  //   const fieldSchema = schema[fieldName];

  //   // 2. check field lengths
  //   if (fieldSchema.limit && value.length > fieldSchema.limit) {
  //     validationErrors.push({
  //       id: 'app.field_is_too_long',
  //       data: { name: fieldName, limit: fieldSchema.limit },
  //     });
  //   }

  //   // 3. check that fields have the proper type
  //   // TODO
  // });

  // // 4. check that required fields have a value
  // // when editing, we only want to require fields that are actually part of the form
  // // so we make sure required keys are present in the $unset object
  // _.keys(schema).forEach(fieldName => {
  //   const fieldSchema = schema[fieldName];

  //   if (unset[fieldName] && (fieldSchema.required || !fieldSchema.optional) && typeof set[fieldName] === 'undefined') {
  //     validationErrors.push({
  //       id: 'app.required_field_missing',
  //       data: { name: fieldName },
  //     });
  //   }
  // });

  // 5. still run SS validation for now for backwards compatibility
  const validationContext = collection.simpleSchema().newContext();
  validationContext.validate({ $set: set, $unset: unset }, { modifier: true });

  if (!validationContext.isValid()) {
    const errors = validationContext.validationErrors();
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      // console.log(error);
      validationErrors.push({
        id: `errors.${error.type}`,
        path: error.name,
        properties: error,
      });
    });
  }

  return validationErrors;
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
    if (!fieldSchema || !Users.canInsertField(currentUser, fieldSchema)) {
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
  modifiedProperties.forEach(function(fieldName) {
    var field = schema[fieldName];
    if (!field || !Users.canEditField(currentUser, field, document)) {
      validationErrors.push({
        id: 'app.disallowed_property_detected',
        data: {name: fieldName},
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
    console.log('// validationContext');
    console.log(validationContext.isValid());
    console.log(errors);
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
