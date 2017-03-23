/*
  Let's add an international label to the field added in custom_fields.js
*/

import { addStrings } from 'meteor/nova:core';

addStrings('en', {
  "posts.color": "Color" // add a new one (collection.field: "Label")
});