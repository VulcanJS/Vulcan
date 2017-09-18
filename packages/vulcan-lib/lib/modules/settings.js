import { Utils } from './utils.js';

export const Settings = {};

export const getSetting = (settingName, defaultValue) => {

  let setting;

  if (Meteor.isServer) {
    // look in public, private, and root
    const rootSetting = Utils.getNestedProperty(Meteor.settings, settingName);
    const privateSetting = Meteor.settings.private && Utils.getNestedProperty(Meteor.settings.private, settingName);
    const publicSetting = Meteor.settings.public && Utils.getNestedProperty(Meteor.settings.public, settingName);
    
    // if setting is an object, "collect" properties from all three places
    if (typeof rootSetting === 'object' || typeof privateSetting === 'object' || typeof publicSetting === 'object') {
      setting = {
        ...defaultValue,
        ...rootSetting,
        ...privateSetting,
        ...publicSetting,
      }
    } else {
      setting = rootSetting || privateSetting || publicSetting || defaultValue;
    }

  } else {
    // look only in public
    const publicSetting = Meteor.settings.public && Utils.getNestedProperty(Meteor.settings.public, settingName);
    setting = publicSetting || defaultValue;
  }

  Settings[settingName] = setting;

  return setting;

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