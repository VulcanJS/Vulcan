// push "search" template to primaryNav
Telescope.modules.add("primaryNav", {
  template: 'search',
  order: 100
});

Telescope.modules.add("mobileNav", {
  template: 'search',
  order: 1
});

Telescope.modules.add("adminMenu", {
  route: 'searchLogs',
  label: 'search_logs',
  description: 'see_what_people_are_searching_for'
});

Telescope.colorElements.add('.search .search-field', 'secondaryContrastColor');

Searches = new Meteor.Collection("searches", {
  schema: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    timestamp: {
      type: Date
    },
    keyword: {
      type: String
    }
  })
});

Meteor.startup(function() {
  Searches.allow({
    update: Users.is.adminById
  , remove: Users.is.adminById
  });
});

// search post list parameters
Posts.views.add("search", function (terms, baseParameters) {
  // if query is empty, just return parameters that will result in an empty collection
  if(typeof terms.query === 'undefined' || !terms.query)
    return {find:{_id: 0}};

  var parameters = Telescope.utils.deepExtend(true, baseParameters, {
    find: {
      $or: [
        {title: {$regex: terms.query, $options: 'i'}},
        {url: {$regex: terms.query, $options: 'i'}},
        {body: {$regex: terms.query, $options: 'i'}}
      ]
    }
  });
  return parameters;
});
