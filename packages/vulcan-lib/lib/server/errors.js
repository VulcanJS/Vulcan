import { UserInputError } from 'apollo-server';

/*

An error should have: 

- id: will be used as i18n key (note: available as `name` on the client)
- message: optionally, a plain-text message
- data: data/values to give more context to the error

*/
export const throwError = error => {
  const { id, } = error;
  throw new UserInputError(id, error);
};
