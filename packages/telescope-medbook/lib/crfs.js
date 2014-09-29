crfSchema = new SimpleSchema({
 _id: {
    type: String,
    optional: true
  },
  order: {
    type: Number,
    optional: true
  },
  slug: {
    type: String
  },
  name: {
    type: String
  },    
});

CRFs = new Meteor.Collection("crfs", {
  schema: crfSchema
});

// crf post list parameters
viewParameters.crf = function (terms) { 
  return {
    find: {'crfs.slug': terms.crf},
    options: {sort: {sticky: -1, score: -1}}
  };
}

// push "crfs" modules to postHeading
postHeading.push({
  template: 'postCRFs',
  order: 3
});
  
// push "crfsMenu" template to primaryNav
primaryNav.push('crfsMenu');

// push "crfs" property to addToPostSchema, so that it's later added to postSchema
addToPostSchema.push(
  {
    propertyName: 'crfs',
    propertySchema: {
      type: [crfSchema],
      optional: true
    }
  }
);

var getCheckedCRFs = function (properties) {
  properties.crfs = [];
  $('input[name=crf]:checked').each(function() {
    var crfId = $(this).val();
    properties.crfs.push(CRFs.findOne(crfId));
  });
  return properties;
}

postSubmitClientCallbacks.push(getCheckedCRFs);
postEditClientCallbacks.push(getCheckedCRFs);

Meteor.startup(function () {
  CRFs.allow({
    insert: isAdminById
  , update: isAdminById
  , remove: isAdminById
  });

  Meteor.methods({
    crf: function(crf){
      console.log(crf)
      if (!Meteor.user() || !isAdmin(Meteor.user()))
        throw new Meteor.Error(i18n.t('You need to login and be an admin to add a new crf.'));
      var crfId=CRFs.insert(crf);
      return crf.name;
    }
  });
});

getCRFUrl = function(slug){
  return getSiteUrl()+'crf/'+slug;
};
