import SimpleSchema from 'simpl-schema';
import { Utils, getCollection, Connectors, Locales } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

///////////////////////////////////////
// Order for the Schema is as follows. Change as you see fit:
// 00.
// 10. Display Name
// 20. Email
// 30. Bio
// 40. Slug
// 50. Website
// 60. Twitter username
// 70.
// 80.
// 90.
// 100.
// Anything else..
///////////////////////////////////////

const createDisplayName = user => {
  const profileName = Utils.getNestedProperty(user, 'profile.name');
  const twitterName = Utils.getNestedProperty(user, 'services.twitter.screenName');
  const linkedinFirstName = Utils.getNestedProperty(user, 'services.linkedin.firstName');
  if (profileName) return profileName;
  if (twitterName) return twitterName;
  if (linkedinFirstName)
    return `${linkedinFirstName} ${Utils.getNestedProperty(user, 'services.linkedin.lastName')}`;
  if (user.username) return user.username;
  if (user.email) return user.email.slice(0, user.email.indexOf('@'));
  return undefined;
};

const adminGroup = {
  name: 'admin',
  order: 100,
};

const ownsOrIsAdmin = (user, document) => {
  return getCollection('Users').owns(user, document) || getCollection('Users').isAdmin(user);
};

/**
 * @summary Users schema
 * @type {Object}
 */
const schema = {
  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },
  username: {
    type: String,
    optional: true,
    canRead: ['guests'],
    canUpdate: ['admins'],
    canCreate: ['members'],
    onCreate: ({ document: user }) => {
      if (
        !user.username &&
        user.services &&
        user.services.twitter &&
        user.services.twitter.screenName
      ) {
        return user.services.twitter.screenName;
      }
    },
    searchable: true,
  },
  emails: {
    type: Array,
    optional: true,
    onCreate: ({ document }) => {
      // simulate Accounts behaviour
      if (!document.emails && document.email) return [{ address: document.email }];
    }
  },
  'emails.$': {
    type: Object,
    optional: true,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  'emails.$.verified': {
    type: Boolean,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['admins'],
    onCreate: () => {
      return new Date();
    },
  },
  isAdmin: {
    type: Boolean,
    label: 'Admin',
    input: 'checkbox',
    optional: true,
    canCreate: ['admins'],
    canUpdate: ['admins'],
    canRead: ['guests'],
    group: adminGroup,
  },
  locale: {
    type: String,
    label: 'Preferred Language',
    optional: true,
    input: 'select',
    canCreate: ['members'],
    canUpdate: ['members'],
    canRead: ['guests'],
    options: () => Locales.map(({ id, label }) => ({ value: id, label })),
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
    hidden: true,
    canCreate: ['members'],
  },
  // // telescope-specific data, kept for backward compatibility and migration purposes
  // telescope: {
  //   type: Object,
  //   blackbox: true,
  //   optional: true,
  // },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
    canRead: ownsOrIsAdmin,
  },
  /**
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique
  */
  displayName: {
    type: String,
    optional: true,
    input: 'text',
    canCreate: ['members'],
    canUpdate: ['members'],
    canRead: ['guests'],
    order: 10,
    onCreate: ({ document: user }) => {
      return createDisplayName(user);
    },
    searchable: true,
  },
  /**
    The user's email. Modifiable.
  */
  email: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
    mustComplete: true,
    input: 'text',
    canCreate: ['members'],
    canUpdate: ['members'],
    canRead: ownsOrIsAdmin,
    order: 20,
    onCreate: ({ document: user }) => {
      // look in a few places for the user email
      const meteorEmails = Utils.getNestedProperty(user, 'services.meteor-developer.emails');
      const facebookEmail = Utils.getNestedProperty(user, 'services.facebook.email');
      const githubEmail = Utils.getNestedProperty(user, 'services.github.email');
      const googleEmail = Utils.getNestedProperty(user, 'services.google.email');
      const linkedinEmail = Utils.getNestedProperty(user, 'services.linkedin.emailAddress');

      if (meteorEmails) return _.findWhere(meteorEmails, { primary: true }).address;
      if (facebookEmail) return facebookEmail;
      if (githubEmail) return githubEmail;
      if (googleEmail) return googleEmail;
      if (linkedinEmail) return linkedinEmail;
      return undefined;
    },
    searchable: true,
    // unique: true // note: find a way to fix duplicate accounts before enabling this
  },
  /**
    A hash of the email, used for Gravatar // TODO: change this when email changes
  */
  emailHash: {
    type: String,
    optional: true,
    canRead: ['guests'],
    onCreate: ({ document: user }) => {
      if (user.email) {
        return getCollection('Users').avatar.hash(user.email);
      }
    },
  },
  avatarUrl: {
    type: String,
    optional: true,
    canRead: ['guests'],
    onCreate: ({ document: user }) => {
      const twitterAvatar = Utils.getNestedProperty(
        user,
        'services.twitter.profile_image_url_https'
      );
      const facebookId = Utils.getNestedProperty(user, 'services.facebook.id');

      if (twitterAvatar) return twitterAvatar;
      if (facebookId) return `https://graph.facebook.com/${facebookId}/picture?type=large`;
      return undefined;
    },
    resolveAs: {
      fieldName: 'avatarUrl',
      type: 'String',
      resolver: async (user, args, { Users }) => {
        if (_.isEmpty(user)) return null;

        if (user.avatarUrl) {
          return user.avatarUrl;
        } else {
          // user has already been cleaned up by Users.restrictViewableFields, so we
          // reload the full user object from the cache to access user.services
          const fullUser = await Users.loader.load(user._id);
          return Users.avatar.getUrl(fullUser);
        }
      },
    },
  },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  slug: {
    type: String,
    optional: true,
    canRead: ['guests'],
    order: 40,
    onCreate: ({ document: user }) => {
      // create a basic slug from display name and then modify it if this slugs already exists;
      const displayName = createDisplayName(user);
      const basicSlug = Utils.slugify(displayName);
      //if the basic slug is falsy, use the user id instead to avoid empty slugs
      return basicSlug ? Utils.getUnusedSlugByCollectionName('Users', basicSlug) : user._id;
    },
  },
  /**
  The user's Twitter username
*/
  twitterUsername: {
    type: String,
    optional: true,
    input: 'text',
    canCreate: ['members'],
    canUpdate: ['members'],
    canRead: ['guests'],
    order: 60,
    resolveAs: {
      type: 'String',
      resolver: async (user, args, { Users }) => {
        return Users.getTwitterName(await Connectors.get(Users, user._id));
      },
    },
    onCreate: ({ document: user }) => {
      if (user.services && user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      }
    },
  },
  /**
    Groups
  */
  groups: {
    type: Array,
    optional: true,
    input: 'checkboxgroup',
    canCreate: ['admins'],
    canUpdate: ['admins'],
    canRead: ['guests'],
    group: adminGroup,
    form: {
      options: function () {
        const groups = _.without(
          _.keys(getCollection('Users').groups),
          'guests',
          'members',
          'admins'
        );
        return groups.map(group => {
          return { value: group, label: group };
        });
      },
    },
  },
  'groups.$': {
    type: String,
    optional: true,
  },

  // GraphQL only fields

  pageUrl: {
    type: String,
    optional: true,
    canRead: ['guests'],
    resolveAs: {
      type: 'String',
      resolver: (user, args, { Users }) => {
        return Users.getProfileUrl(user, true);
      },
    },
  },

  pagePath: {
    type: String,
    optional: true,
    canRead: ['guests'],
    resolveAs: {
      type: 'String',
      resolver: (user, args, { Users }) => {
        return Users.getProfileUrl(user, false);
      },
    },
  },

  editUrl: {
    type: String,
    optional: true,
    canRead: ['guests'],
    resolveAs: {
      type: 'String',
      resolver: (user, args, { Users }) => {
        return Users.getEditUrl(user, true);
      },
    },
  },
};

export default schema;
