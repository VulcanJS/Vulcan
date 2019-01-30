/** GraphQL Playground setup, through Apollo "gui" option */

export const getPlaygroundConfig = currentConfig => {
  // NOTE: this is redundant, Apollo won't show the GUI if NODE_ENV="production"
  if (!Meteor.isDevelopment) return undefined;
  return {
    endpoint: currentConfig.path,
    // allow override
    //FIXME: this global option does not exist yet...
    // @see https://github.com/prisma/graphql-playground/issues/510
    //headers: { ["Authorization"]: 'localStorage[\'Meteor.loginToken\']' },
    // to set up headers, we are forced to create a tab
    tabs: [
      {
        endpoint: currentConfig.path,
        query: '{ currentUser { _id }}',
        // TODO: does not work, we should use a cookie instead?
        // @see https://github.com/prisma/graphql-playground/issues/849
        // headers: {['Authorization']: "localStorage['Meteor.loginToken']"},
      },
    ],
    settings: {
      'editor.reuseHeaders': true,
      // pass cookies?
      'request.credentials': 'same-origin',
    },
    ...(currentConfig.gui || {}),
  };
};
export default getPlaygroundConfig;
