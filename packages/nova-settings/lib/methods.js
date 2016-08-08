import Telescope from 'meteor/nova:lib';
import Users from 'meteor/nova:users';

Telescope.settings.collection.smartMethods({
  editName: "settings.edit"
});

Meteor.methods({
  "settings.getJSON": function () {
    if (Users.isAdminById(this.userId)) {
      return Meteor.settings;
    } else {
      return {};
    }
  },
  "settings.exportToJSON": function () {
    if (Users.isAdminById(this.userId)) {
      let settings = Telescope.settings.collection.findOne();
      const schema = Telescope.settings.collection.simpleSchema()._schema;
      const publicFields = Telescope.settings.collection.getPublicFields();
      delete settings._id;
      settings.public = {};
      _.forEach(settings, (field, key) => {
        if (_.contains(publicFields, key)) {
          settings.public[key] = field;
          delete settings[key];
        }
      });
      console.log(JSON.stringify(settings, null, 2));
      return settings;
    }
  },
  "settings.clear": function () {
    if (Users.isAdminById(this.userId)) {
      const settings = Telescope.settings.collection.findOne();
      Telescope.settings.collection.update(settings._id, {}, {validate: false});
    }
  }
})