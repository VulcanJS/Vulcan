// Load categories from settings, if there are any


if (Meteor.settings && Meteor.settings.categories) {
  Meteor.settings.categories.forEach(category => {

    // look for existing category with same slug
    let existingCategory = Categories.findOne({slug: category.slug});

    if (existingCategory) {
      // if category exists, update it with settings data except slug
      delete category.slug;
      Categories.update(existingCategory._id, {$set: category});
    } else {
      // if not, create it
      Categories.insert(category);
      console.log(`// Creating category “${category.name}”`);
    }
  });
}
