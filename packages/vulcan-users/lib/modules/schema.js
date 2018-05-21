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
    viewableBy: ['guests'],
  },
  username: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['guests'],
    onInsert: user => {
      if (user.services && user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      }
    },
    searchable: true
  },
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
    optional: true,
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  "emails.$.verified": {
    type: Boolean,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['admins'],
    onInsert: () => {
      return new Date();
    }
  },
  isAdmin: {
    type: Boolean,
    label: "Admin",
    control: "checkbox",
    optional: true,
    insertableBy: ['admins'],
    editableBy: ['admins'],
    viewableBy: ['guests'],
    group: adminGroup,
  },
  locale: {
    type: String,
    label: "Preferred Language",
    optional: true,
    control: 'select',
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
    options: () => Locales.map(({ id, label }) => ({ value: id, label })),
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
    insertableBy: ['guests'],
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
    viewableBy: ownsOrIsAdmin,
  },
  /**
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique
  */
  displayName: {
    type: String,
    optional: true,
    control: "text",
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
    order: 10,
    onInsert: (user, options) => {
      const profileName = Utils.getNestedProperty(user, 'profile.name');
      const twitterName = Utils.getNestedProperty(user, 'services.twitter.screenName');
      const linkedinFirstName = Utils.getNestedProperty(user, 'services.linkedin.firstName');
      if (profileName) return profileName;
      if (twitterName) return twitterName;
      if (linkedinFirstName) return `${linkedinFirstName} ${Utils.getNestedProperty(user, 'services.linkedin.lastName')}`;
      if (user.username) return user.username;
      return undefined;
    },
    searchable: true
  },
  /**
    The user's email. Modifiable.
  */
  email: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
    mustComplete: true,
    control: "text",
    insertableBy: ['guests'],
    editableBy: ['members'],
    viewableBy: ownsOrIsAdmin,
    order: 20,
    onInsert: (user) => {
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
    searchable: true
    // unique: true // note: find a way to fix duplicate accounts before enabling this
  },
  /**
    A hash of the email, used for Gravatar // TODO: change this when email changes
  */
  emailHash: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: user => {
      if (user.email) {
        return getCollection('Users').avatar.hash(user.email);
      }
    }
  },
  avatarUrl: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: user => {

      const twitterAvatar = Utils.getNestedProperty(user, 'services.twitter.profile_image_url_https');
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
        
      }
    }
  },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    order: 40,
    onInsert: user => {
      // create a basic slug from display name and then modify it if this slugs already exists;
      const basicSlug = Utils.slugify(user.displayName);
      return Utils.getUnusedSlugByCollectionName('Users', basicSlug);
    }
  },
    /**
    The user's Twitter username
  */
  twitterUsername: {
    type: String,
    optional: true,
    control: "text",
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
    order: 60,
    resolveAs: {
      type: 'String',
      resolver: async (user, args, { Users }) => {
        return Users.getTwitterName(await Connectors.get(Users, user._id));
      },
    },
    onInsert: user => {
      if (user.services && user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      }
    }
  },
  /**
    Groups
  */
  groups: {
    type: Array,
    optional: true,
    control: "checkboxgroup",
    insertableBy: ['admins'],
    editableBy: ['admins'],
    viewableBy: ['guests'],
    group: adminGroup,
    form: {
      options: function () {
        const groups = _.without(_.keys(getCollection('Users').groups), "guests", "members", "admins");
        return groups.map(group => {return {value: group, label: group};});
      }
    },
  },
  'groups.$': {
    type: String,
    optional: true
  },

  // GraphQL only fields

  pageUrl: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: {
      type: 'String',
      resolver: (user, args, { Users }) => {
        return Users.getProfileUrl(user, true);
      },
    }  
  },

  editUrl: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    resolveAs: {
      type: 'String',
      resolver: (user, args, { Users }) => {
        return Users.getEditUrl(user, true);
      },
    }  
  }

};

export default schema;
