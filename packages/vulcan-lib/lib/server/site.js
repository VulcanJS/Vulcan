import { addGraphQLSchema, addGraphQLResolvers, addGraphQLQuery } from '../modules/graphql.js';
import { Utils } from '../modules/utils';
import { getSetting } from '../modules/settings.js';
import { sourceVersion } from './source_version.js';

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
        sourceVersion,
      };
    },
  },
};

addGraphQLResolvers(siteResolvers);

addGraphQLQuery('SiteData: Site');
