export const getSetting = (setting, defaultValue) => {

  if (Meteor.isServer) {
    // look in public, private, and root
    const rootSetting = Meteor.settings && Meteor.settings[setting];
    const privateSetting = Meteor.settings && Meteor.settings.private && Meteor.settings.private[setting];
    const publicSetting = Meteor.settings && Meteor.settings.public && Meteor.settings.public[setting];
    
    // if setting is an object, "collect" properties from all three places
    if (typeof rootSetting === 'object' || typeof privateSetting === 'object' || typeof publicSetting === 'object') {
      return {
        ...rootSetting,
        ...privateSetting,
        ...publicSetting,
        ...defaultValue
      }
    } else {
      return rootSetting || privateSetting || publicSetting || defaultValue;
    }

  } else {
    // look only in public
    const publicSetting = Meteor.settings && Meteor.settings.public && Meteor.settings.public[setting];
    return publicSetting || defaultValue;
  }

}

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