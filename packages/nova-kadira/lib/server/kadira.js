import Telescope from 'meteor/nova:lib';
import { Kadira } from 'meteor/meteorhacks:kadira';

Meteor.startup(function() {
  if(process.env.NODE_ENV === "production" && !!Telescope.settings.get('kadiraAppId') && !!Telescope.settings.get('kadiraAppSecret')){
    Kadira.connect(Telescope.settings.get('kadiraAppId'), Telescope.settings.get('kadiraAppSecret'));
  }
});
