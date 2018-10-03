/** GraphQL Playground setup, through Apollo "gui" option */

export const getGuiConfig = currentConfig => {
  // NOTE: this is redundant, Apollo won't show the GUI if NODE_ENV="production"
  if (!Meteor.isDevelopment) return undefined;
  return {
    endpoint: currentConfig.path,
    // allow override
    ...(currentConfig.gui || {})
    //FIXME: this option does not exist yet...
    // @see https://github.com/prisma/graphql-playground/issues/510
    //headers: { ["Authorization"]: 'localStorage[\'Meteor.loginToken\']' },
  };
};
export default getGuiConfig;
