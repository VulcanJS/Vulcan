import { addGraphQLSchema, addGraphQLResolvers, addGraphQLQuery } from '../modules/graphql.js';
import { Utils } from '../modules/utils';
import { getSetting, registerSetting } from '../modules/settings.js';

const siteSchema = `
  type Site {
    title: String
    url: String
    logoUrl: String
  }
`;
addGraphQLSchema(siteSchema);

const siteResolvers = {
  Query: {
    SiteData(root, args, context) {
      return {
        title: getSetting('title'),
        url: getSetting('siteUrl', Meteor.absoluteUrl()),
        logoUrl: Utils.getLogoUrl(),
      };
    },
  },
};

addGraphQLResolvers(siteResolvers);

addGraphQLQuery(`SiteData: Site`);
