import { createError } from 'apollo-errors';

/*

Get whatever word is contained between the first two double quotes

*/
const getFirstWord = input => {
  const parts = /"([^"]*)"/.exec(input);
  if (parts === null) {
    return null;
   }
   return parts[1];
};

/* 

Parse a GraphQL error message

Sample message: 

"GraphQL error: Variable "$data" got invalid value {"meetingDate":"2018-08-07T06:05:51.704Z"}.
In field "name": Expected "String!", found null.
In field "stage": Expected "String!", found null.
In field "addresses": Expected "[JSON]!", found null."

*/

const parseErrorMessage = message => {

  // note: optionally add .slice(1) at the end to get rid of the first error, which is not that helpful
  let fieldErrors = message.split('\n');

  fieldErrors = fieldErrors.map(error => {
    // field name is whatever is between the first to double quotes
    const fieldName = getFirstWord(error);
    if (error.includes('found null')) {
      // missing field errors 
      return {
        id: 'errors.required',
        path: fieldName,
        properties: {
          name: fieldName,
        },
      };
    } else {
      // other generic GraphQL errors
      return { 
        message: error
      };
    }
  });
  return fieldErrors;
};
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
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
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
      // 4. there is no data object, try to parse raw error message
      errors = parseErrorMessage(graphQLError.message);
    }
  }
  return errors;
};

/*

An error should have: 

- id: will be used as i18n key (note: available as `name` on the client)
- message: optionally, a plain-text message
- data: data/values to give more context to the error

*/
export const throwError = error => {
  const { id, message = id, data } = error;
  const MissingDocumentError = createError(id, { message });
  throw new MissingDocumentError({ id, data });
};