import { addGraphQLSchema, addGraphQLResolvers, addGraphQLQuery } from '../modules/graphql.js';
import { getSetting } from '../modules/settings.js';

const siteSchema = `
  type Site {
    title: String
    url: String
  }
`;
addGraphQLSchema(siteSchema);

const siteResolvers = {
  Query: {
    SiteData(root, args, context) {
      return {title: getSetting('title'), url: getSetting('siteUrl', Meteor.absoluteUrl())}
    }
  }
};

addGraphQLResolvers(siteResolvers);

addGraphQLQuery(`SiteData: Site`);
