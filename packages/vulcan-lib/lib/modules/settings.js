const getSettingFromJSON = function (setting, defaultValue) {
  if (Meteor.isServer && Meteor.settings && typeof Meteor.settings[setting] !== "undefined") { // if on the server, look in Meteor.settings
    return Meteor.settings[setting];
  } else if (Meteor.isServer && Meteor.settings && Meteor.settings.private && typeof Meteor.settings.private[setting] !== "undefined") { // if on the server, look in Meteor.settings.private
    return Meteor.settings.private[setting];
  } else if (Meteor.settings && Meteor.settings.public && typeof Meteor.settings.public[setting] !== "undefined") { // look in Meteor.settings.public
    return Meteor.settings.public[setting];
  } else if (defaultValue) {
    return defaultValue;
  } else {
    return undefined;
  }
}

export const getSetting = getSettingFromJSON;

// Settings collection is deprecated
// getSetting = function (setting, defaultValue) {

//   const collection = Telescope.settings.collection;

//   if (typeof getSettingFromJSON(setting) !== "undefined") { // if on the server, look in Meteor.settings

//     return getSettingFromJSON(setting);

//   } else if (collection && collection.findOne() && typeof collection.findOne()[setting] !== "undefined") { // look in collection

//     return Telescope.settings.collection.findOne()[setting];

//   } else if (typeof defaultValue !== 'undefined') { // fallback to default

//     return  defaultValue;

//   } else { // or return undefined

//     return undefined;

//   }
// };