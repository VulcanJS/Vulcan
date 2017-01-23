import Categories from "../collection.js";
import { Utils, newMutation } from 'meteor/nova:core';

// Load categories from settings, if there are any

if (Meteor.settings && Meteor.settings.categories) {
  Meteor.settings.categories.forEach(category => {

    // get slug (or slugified name)
    const slug = category.slug || Utils.slugify(category.name);

    // look for existing category with same slug
    let existingCategory = Categories.findOne({slug: slug});

    if (existingCategory) {
      // if category exists, update it with settings data except slug
      delete category.slug;
      Categories.update(existingCategory._id, {$set: category});
    } else {
      // if not, create it
      newMutation({
        collection: Categories,
        document: category, 
        validate: false,
      });
      
      // Categories.insert(category);
      console.log(`// Creating category “${category.name}”`); // eslint-disable-line
    }
  });
}
