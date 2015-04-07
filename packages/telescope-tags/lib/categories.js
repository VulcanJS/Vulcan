// category schema
categorySchema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true
  },
  slug: {
    type: String,
    optional: true
  },
  image: {
    type: String,
    optional: true
  }
});

Categories = new Meteor.Collection("categories");
Categories.attachSchema(categorySchema);

Categories.before.insert(function (userId, doc) {
  // if no slug has been provided, generate one
  if (!doc.slug)
    doc.slug = slugify(doc.name);
});

// category post list parameters
viewParameters.category = function (terms) {
  var categoryId = Categories.findOne({slug: terms.category})._id;
  return {
    find: {'categories': {$in: [categoryId]}} ,
    options: {sort: {sticky: -1, score: -1}} // for now categories views default to the "top" view
  };
}

Meteor.startup(function () {
  Categories.allow({
    insert: isAdminById,
    update: isAdminById,
    remove: isAdminById
  });
});

getPostCategories = function (post) {
  return !!post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];
}

getCategoryUrl = function(slug){
  return getSiteUrl()+'category/'+slug;
};

// add callback that adds categories CSS classes
postClassCallbacks.push(function (post, postClass){
  var classArray = _.map(getPostCategories(post), function (category){return "category-"+category.slug});
  return postClass + " " + classArray.join(' ');
});