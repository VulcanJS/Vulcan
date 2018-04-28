/*

Errors can have the following properties stored on their `data` property:
  - id: used as an internationalization key, for example `errors.required`
  - path: for field-specific errors inside forms, the path of the field with the issue
  - properties: additional data. Will be passed to vulcan-i18n as values
  - message: if id cannot be used as i81n key, message will be used
  
Scenario 1: normal error thrown with new Error(), put it in array and return it

Scenario 2: multiple GraphQL errors stored on data.errors

Scenario 3: single GraphQL error with data property

Scenario 4: single GraphQL error with no data property

*/
export const getErrors = error => {

  // 1. wrap in array
  let errors = [error];

  // if this is one or more GraphQL errors, extract and convert them
  if (error.graphQLErrors) {
    // get graphQL error (see https://github.com/thebigredgeek/apollo-errors/issues/12)
    const graphQLError = error.graphQLErrors[0];
    if (graphQLError.data && !_.isEmpty(graphQLError.data)) {
      if (graphQLError.data.errors) {
        // 2. there are multiple errors on the data.errors object
        errors = graphQLError.data && graphQLError.data.errors;
      } else {
        // 3. there is only one error
        errors = [graphQLError.data];
      }
    } else {
      // 4. there is no data object, just use raw error
      errors = [graphQLError];
    }
  }
  return errors;
}