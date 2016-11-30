import Telescope from 'meteor/nova:lib';
import mutations from './mutations.js';

const adminGroup = {
  name: "admin",
  order: 10
};

/**
 * @summary Users schema
 * @type {Object}
 */
const schema = { 
  _id: {
    type: String,
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
    preload: true,
  },
  username: {
    type: String,
    // regEx: /^[a-z0-9A-Z_]{3,15}$/,
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
    preload: true,
  },
  emails: {
    type: [Object],
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
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
    preload: true,
  },
  isAdmin: {
    type: Boolean,
    label: "Admin",
    control: "checkbox",
    optional: true,
    insertableIf: ['admins'],
    editableIf: ['admins'],
    viewableIf: ['anonymous'],
    group: adminGroup,
    preload: true,
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // telescope-specific data, kept for backward compatibility and migration purposes
  telescope: { 
    type: Object,
    blackbox: true,
    optional: true,
    viewableIf: ['anonymous'],
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  /**
    Bio (Markdown version)
  */
  __bio: {
    type: String,
    optional: true,
    control: "textarea",
    insertableIf: ['default'],
    editableIf: ['default'],
    viewableIf: ['anonymous'],
  },
  /**
    The name displayed throughout the app. Can contain spaces and special characters, doesn't need to be unique
  */
  __displayName: {
    type: String,
    optional: true,
    publish: true,
    profile: true,
    control: "text",
    insertableIf: ['default'],
    editableIf: ['default'],
    viewableIf: ['anonymous'],
    preload: true,
  },
  /**
    The user's email. Modifiable.
  */
  __email: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Email,
    required: true,
    control: "text",
    insertableIf: ['default'],
    editableIf: ['default'],
    viewableIf: ['anonymous'],
    preload: true,
    // unique: true // note: find a way to fix duplicate accounts before enabling this
  },
  /**
    A hash of the email, used for Gravatar // TODO: change this when email changes
  */
  __emailHash: {
    type: String,
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
    preload: true,
  },
  /**
    The HTML version of the bio field
  */
  __htmlBio: {
    type: String,
    publish: true,
    profile: true,
    optional: true,
    viewableIf: ['anonymous'],
  },
  /**
    The user's karma
  */
  __karma: {
    type: Number,
    decimal: true,
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
  },
  /**
    The user's profile URL slug // TODO: change this when displayName changes
  */
  __slug: {
    type: String,
    publish: true,
    optional: true,
    viewableIf: ['anonymous'],
    preload: true,
  },
  /**
    The user's Twitter username
  */
  __twitterUsername: {
    type: String,
    optional: true,
    publish: true,
    profile: true,
    control: "text",
    insertableIf: ['default'],
    editableIf: ['default'],
    viewableIf: ['anonymous'],
  },
  /**
    A link to the user's homepage
  */
  __website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    publish: true,
    profile: true,
    optional: true,
    control: "text",
    insertableIf: ['default'],
    editableIf: ['default'],
    viewableIf: ['anonymous'],
  },
  /**
    Groups
  */
  __groups: {
    type: [String],
    optional: true,
    control: "checkboxgroup",
    insertableIf: ['admins'],
    editableIf: ['admins'],
    viewableIf: ['anonymous'],
    form: {
      options: function () {
        const groups = _.without(_.keys(Users.groups), "anonymous", "default", "admins");
        return groups.map(group => {return {value: group, label: group};});
      }
    },
    preload: true,
  },
};

export default schema;
