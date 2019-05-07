import get from 'lodash/get';

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

TODO: check if still useful?

Sample message: 

"GraphQL error: Variable "$data" got invalid value {"meetingDate":"2018-08-07T06:05:51.704Z"}.
In field "name": Expected "String!", found null.
In field "stage": Expected "String!", found null.
In field "addresses": Expected "[JSON]!", found null."

*/

export const parseErrorMessage = message => {

  if (!message) {
    return null;
  }

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
        message: error,
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
  
*/
export const getErrors = error => {

  const graphQLErrors = error.graphQLErrors;
  
  // error thrown using new ApolloError
  const apolloErrors = get(graphQLErrors, '0.extensions.exception.data.errors');

  // regular server error (with schema stitching)
  const regularErrors = get(graphQLErrors, '0.extensions.exception.errors');

  return apolloErrors || regularErrors || graphQLErrors;
 
};
