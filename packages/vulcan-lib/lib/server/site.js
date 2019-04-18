import { addGraphQLSchema, addGraphQLResolvers, addGraphQLQuery } from '../modules/graphql';
import { Utils } from '../modules/utils';
import { getSetting } from '../modules/settings.js';
import { getSourceVersion } from './source_version.js';

const siteSchema = `type Site {
  title: String
  url: String
  logoUrl: String
  sourceVersion: String
}`;
addGraphQLSchema(siteSchema);

const siteResolvers = {
  Query: {
    SiteData(root, args, context) {
      return {
        title: getSetting('title'),
        url: getSetting('siteUrl', Meteor.absoluteUrl()),
        logoUrl: Utils.getLogoUrl(),
        sourceVersion: getSourceVersion(),
      };
    },
  },
};

addGraphQLResolvers(siteResolvers);

addGraphQLQuery('SiteData: Site');
