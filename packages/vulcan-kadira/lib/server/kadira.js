import { Kadira } from 'meteor/meteorhacks:kadira';
import { getSetting } from 'meteor/vulcan:core';

Meteor.startup(function() {
  if(process.env.NODE_ENV === "production" && !!getSetting('kadiraAppId') && !!getSetting('kadiraAppSecret')){
    Kadira.connect(getSetting('kadiraAppId'), getSetting('kadiraAppSecret'));
  }
});
