Telescope.settings = {};

Telescope.settings.get = function(setting, defaultValue) {

  if (Telescope.settings.collection && Telescope.settings.collection.findOne() && !!Telescope.settings.collection.findOne()[setting]) {

    return Telescope.settings.collection.findOne()[setting];

  } else if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // if on the server, look in Meteor.settings

    return Meteor.settings[setting];

  } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public

    return Meteor.settings.public[setting];

  } else if (typeof defaultValue !== 'undefined') { // fallback to default

    return  defaultValue;

  } else { // or return undefined

    return undefined;

  }
};