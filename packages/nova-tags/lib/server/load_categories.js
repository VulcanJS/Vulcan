// Load categories from settings, if there are any

Meteor.startup(()=>{

  let count = 0;

  if (Meteor.settings && Meteor.settings.categories) {
    Meteor.settings.categories.forEach(category => {

      // look for existing category with same slug
      const existingCategory = Categories.findOne({slug: category.slug});
      
      if (existingCategory) {
        // if category exists, update it with settings data
        Categories.update(existingCategory._id, {$set: category});
      } else {
        // if not, create it
        Categories.insert(category);
        count ++;
      }
    });
  }

  if (count) {
    console.log(`// Created ${count} new categories`);
  }

});