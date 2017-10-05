import Vulcan from './config.js';
import { Utils } from './utils.js';
import flatten from 'flat';

export const Settings = {};

export const getAllSettings = () => {

  const settingsObject = {};

  let rootSettings = _.clone(Meteor.settings);
  delete rootSettings.public;
  delete rootSettings.private;

  // root settings & private settings are both private
  rootSettings = flatten(rootSettings, {safe: true});
  const privateSettings = flatten(Meteor.settings.private || {}, {safe: true});

  // public settings
  const publicSettings = flatten(Meteor.settings.public || {}, {safe: true});

  // registered default values
  const registeredSettings = Settings;

  const allSettingKeys = _.union(_.keys(rootSettings), _.keys(publicSettings), _.keys(privateSettings), _.keys(registeredSettings));

  allSettingKeys.sort().forEach(key => {

    settingsObject[key] = {};

    if (typeof rootSettings[key] !== 'undefined') {
      settingsObject[key].value = rootSettings[key];
    } else if (typeof privateSettings[key] !== 'undefined') {
      settingsObject[key].value = privateSettings[key];
    } else if (typeof publicSettings[key] !== 'undefined') {
      settingsObject[key].value = publicSettings[key];
    }
    
    if (typeof publicSettings[key] !== 'undefined'){
      settingsObject[key].public = true;
    }

    if (registeredSettings[key]) {
      if (registeredSettings[key].defaultValue !== null || registeredSettings[key].defaultValue !== undefined) settingsObject[key].defaultValue = registeredSettings[key].defaultValue;
      if (registeredSettings[key].description) settingsObject[key].description = registeredSettings[key].description;
    }

  });

  return _.map(settingsObject, (setting, key) => ({name: key, ...setting}));
}


Vulcan.showSettings = () => {
  return getAllSettings();
}

export const registerSetting = (settingName, defaultValue, description) => {
  Settings[settingName] = { defaultValue, description };
}

export const getSetting = (settingName, settingDefault) => {

  let setting;

  // if a default value has been registered using registerSetting, use it
  const defaultValue = settingDefault || Settings[settingName] && Settings[settingName].defaultValue;

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
      if (typeof rootSetting !== 'undefined') {
        setting = rootSetting;
      } else if (typeof privateSetting !== 'undefined') {
        setting = privateSetting;
      } else if (typeof publicSetting !== 'undefined') {
        setting = publicSetting;
      } else {
        setting = defaultValue;
      }
    }

  } else {
    // look only in public
    const publicSetting = Meteor.settings.public && Utils.getNestedProperty(Meteor.settings.public, settingName);
    setting = publicSetting || defaultValue;
  }

  // Settings[settingName] = {...Settings[settingName], settingValue: setting};

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