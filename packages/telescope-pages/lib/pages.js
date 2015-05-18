Pages = new Mongo.Collection('pages');

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


Pages.schema.internationalize();

Pages.attachSchema(Pages.schema);

Pages.before.insert(function (userId, doc) {
  // if no slug has been provided, generate one
  if (!doc.slug)
    doc.slug = Telescope.utils.slugify(doc.title);
});

Telescope.modules.add("primaryNav", {
  template: "pages_menu",
  order: 5
});

Telescope.modules.add("mobileNav", {
  template: 'pages_menu',
  order: 5
});

Meteor.startup(function () {
  Pages.allow({
    insert: Users.is.adminById,
    update: Users.is.adminById,
    remove: Users.is.adminById
  });

  Meteor.methods({
    insertPage: function(pageTitle, pageContent){
      return Feeds.insert({title: pageTitle, content: pageContent});
    }
  });
});
