Pages = {};

Pages.schema = new SimpleSchema({
  title: {
    type: String
  },
  slug: {
    type: String,
    optional: true
  },
  content: {
    type: String,
    autoform: {
      rows: 10
    }
  },
  order: {
    type: Number,
    optional: true
  }
});

Pages.collection = new Meteor.Collection('pages');
Pages.collection.attachSchema(Pages.schema);

Pages.collection.before.insert(function (userId, doc) {
  // if no slug has been provided, generate one
  if (!doc.slug)
    doc.slug = Telescope.utils.slugify(doc.title);
});

Telescope.config.primaryNav.push({
  template: "pagesMenu",
  order: 5
});

Telescope.config.mobileNav.push({
  template: 'pagesMenu',
  order: 5
});

Meteor.startup(function () {
  Pages.collection.allow({
    insert: Users.isAdminById,
    update: Users.isAdminById,
    remove: Users.isAdminById
  });

  Meteor.methods({
    insertPage: function(pageTitle, pageContent){
      return Feeds.insert({title: pageTitle, content: pageContent});
    }
  });
});
