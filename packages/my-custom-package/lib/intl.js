/*
  Let's add an international label to the field added in custom_fields.js
*/

import Telescope from 'meteor/nova:lib';

Telescope.strings.en = {
  ...Telescope.strings.en, // get all the string translated
  "posts.color": "Color" // add a new one (collection.field: "Label")
};
