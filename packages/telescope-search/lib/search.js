// push "search" template to primaryNav
Telescope.modules.register("primaryNav", {
  template: 'search',
  order: 100
});

Telescope.modules.register("mobileNav", {
  template: 'search',
  order: 1
});

Telescope.modules.register("adminMenu", {
  route: 'searchLogs',
  label: 'search_logs',
  description: 'see_what_people_are_searching_for'
});

Telescope.utils.registerElementColor('.search .search-field', 'secondaryContrastColor');

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
Posts.views.register("search", function (terms, baseParameters) {
  // if query is empty, just return parameters that will result in an empty collection
  if(typeof terms.query === 'undefined' || !terms.query)
    return {find:{_id: 0}};


  paramOpts = {find: {
    $or: [
      {title: {$regex: terms.query, $options: 'i'}},
      {url: {$regex: terms.query, $options: 'i'}},
      {body: {$regex: terms.query, $options: 'i'}}
    ]}
  };

  if(typeof terms.currentCat !== 'undefined' && terms.currentCat !== '' && !!terms.query ){
    var categoryId = Categories.findOne({slug: terms.currentCat})._id;
   console.log('terms.currentCat '+terms.currentCat );
    paramOpts = {find: {
      $or: [
        { $and: [
                {title: {$regex: terms.query, $options: 'i'}},
                {'categories':  {$in: [categoryId]}  }//, $options: {sort: {sticky: -1, score: -1} } this give an error an error if you add it
               ]
        },
        { $and: [
                {url: {$regex: terms.query, $options: 'i'}},
                {'categories':  {$in: [categoryId]}  }//, $options: {sort: {sticky: -1, score: -1} }
               ]
        },
        { $and: [
                {body: {$regex: terms.query, $options: 'i'}},
                {'categories':  {$in: [categoryId]} }//, $options: {sort: {sticky: -1, score: -1} }
               ]
        }
      ]}
    };

  }



  var parameters = Telescope.utils.deepExtend(true, baseParameters, paramOpts);
  return parameters;
});
