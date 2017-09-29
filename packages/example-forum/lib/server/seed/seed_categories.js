import { Categories } from '../../modules/categories/index.js';
import { Utils, newMutation, getSetting } from 'meteor/vulcan:core';

if (getSetting('forum.seedOnStart')) {
  
  const dummyFlag = {
    fieldName: 'isDummy',
    fieldSchema: {
      type: Boolean,
      optional: true,
      hidden: true
    }
  }
  Categories.addField(dummyFlag);

  const dummyCategories = [
    {
      name: 'Test Category 1',
      description: 'The first test category',
      order: 4,
      slug: 'testcat1',
      isDummy: true
    },
    {
      name: 'Test Category 2',
      description: 'The second test category',
      order: 7,
      slug: 'testcat2',
      isDummy: true
    },
    {
      name: 'Test Category 3',
      description: 'The third test category',
      order: 10,
      slug: 'testcat3',
      isDummy: true
    }
  ];

  // Load categories from settings, if there are any
  if (Meteor.settings && Meteor.settings.categories) {
    Meteor.settings.categories.forEach(category => {

      // get slug (or slugified name)
      const slug = category.slug || Utils.slugify(category.name);

      // look for existing category with same slug
      let existingCategory = Categories.findOne({slug: slug});

      // look for parent category
      if (category.parent) {
        const parentCategory = Categories.findOne({slug: category.parent});
        if (parentCategory) {
          category.parentId = parentCategory._id;
          delete category.parent;
        }
      }

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
  } else if (!Categories.find().count()) {
    console.log('// inserting dummy categories');
    // else if there are no categories yet, create dummy categories
    dummyCategories.forEach(category => {
      newMutation({
        collection: Categories,
        document: category, 
        validate: false,
      });
    });
  }

}