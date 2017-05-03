import SimpleSchema from 'simpl-schema';
import Users from './collection.js';
import { Utils } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

const adminGroup = {
  name: "admin",
  order: 10
};

const ownsOrIsAdmin = (user, document) => {
  return Users.owns(user, document) || Users.isAdmin(user);
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
      if (user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      }
    }
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
    viewableBy: ['guests'],
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
    onInsert: user => {
      // if this is not a dummy account, and is the first user ever, make them an admin
      const realUsersCount = Users.find({'isDummy': {$ne: true}}).count();
      return (!user.isDummy && realUsersCount === 0) ? true : false;
    }
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true,
    insertableBy: ['guests'],
  },
  // telescope-specific data, kept for backward compatibility and migration purposes
  telescope: {
    type: Object,
    blackbox: true,
    optional: true,
    viewableBy: ['guests'],
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  /**
    Bio (Markdown version)
  */
  bio: {
    type: String,
    optional: true,
    control: "textarea",
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
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
    onInsert: (user, options) => {
      if (user.profile && user.profile.name) {
        return user.profile.name;
      } else if (user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      } else if (user.services.linkedin && user.services.linkedin.firstName) {
        return user.services.linkedin.firstName + " " + user.services.linkedin.lastName;
      } else if (user.username) {
        return user.username
      }
    }
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
    onInsert: (user) => {
      // look in a few places for the user email
      if (user.services['meteor-developer'] && user.services['meteor-developer'].emails) {
        return _.findWhere(user.services['meteor-developer'].emails, { primary: true }).address;
      } else if (user.services.facebook && user.services.facebook.email) {
        return user.services.facebook.email;
      } else if (user.services.github && user.services.github.email) {
        return user.services.github.email;
      } else if (user.services.google && user.services.google.email) {
        return user.services.google.email;
      } else if (user.services.linkedin && user.services.linkedin.emailAddress) {
        return user.services.linkedin.emailAddress;
      }
    }
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
        return Users.avatar.hash(user.email);
      }
    }
  },
  avatarUrl: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: user => {
      const twitterAvatar = Utils.getNestedProperty(user, 'services.twitter.profile_image_url_https');
      if (twitterAvatar) return twitterAvatar;
    }
  },
  /**
    The HTML version of the bio field
  */
  htmlBio: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
    The user's karma
  */
  karma: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
  },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    onInsert: user => {
      // create a basic slug from display name and then modify it if this slugs already exists;
      const basicSlug = Utils.slugify(user.displayName);
      return Utils.getUnusedSlug(Users, basicSlug);
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
    resolveAs: 'twitterUsername: String',
    onInsert: user => {
      if (user.services && user.services.twitter && user.services.twitter.screenName) {
        return user.services.twitter.screenName;
      }
    }
  },
  /**
    A link to the user's homepage
  */
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
    control: "text",
    insertableBy: ['members'],
    editableBy: ['members'],
    viewableBy: ['guests'],
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
    form: {
      options: function () {
        const groups = _.without(_.keys(Users.groups), "guests", "members", "admins");
        return groups.map(group => {return {value: group, label: group};});
      }
    },
  },
  'groups.$': {
    type: String,
    optional: true
  }
};

export default schema;
