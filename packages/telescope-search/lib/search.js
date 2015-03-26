// push "search" template to primaryNav
primaryNav.push({
  template: 'search',
  order: 100
});

mobileNav.push({
  template: 'search',
  order: 1
});

adminMenu.push({
  route: 'searchLogs',
  label: 'search_logs',
  description: 'see_what_people_are_searching_for'
});

registerElementColor('.search-field', 'secondaryContrastColor');

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
    update: isAdminById
  , remove: isAdminById
  });
});

// search post list parameters
viewParameters.search = function (terms, baseParameters) {
  // if query is empty, just return parameters that will result in an empty collection
  if(typeof terms.query === 'undefined' || !terms.query)
    return {find:{_id: 0}}

  var parameters = deepExtend(true, baseParameters, {
    find: {
      $or: [
        {title: {$regex: terms.query, $options: 'i'}},
        {url: {$regex: terms.query, $options: 'i'}},
        {body: {$regex: terms.query, $options: 'i'}}
      ]
    }
  });
  return parameters;
}
