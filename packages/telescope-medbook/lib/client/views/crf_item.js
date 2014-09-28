Meteor.startup(function () {
  Template[getTemplate('crfItem')].events({
    'click .edit-link': function(e, instance){
      e.preventDefault();
      var crfId = instance.data._id;
      var name = $('#name_'+crfId).val();
      var order = parseInt($('#order_'+crfId).val());
      var slug = slugify(name);
      if(name){
        CRFs.update(crfId,{ $set: {name: name, slug: slug, order: order}});
      }else{
        CRFs.remove(crfId);
      }
      Meteor.call('updateCRFInPosts', crfId, function(error) {
        if (error) {
          throwError(error.reason);
        }
      });
    }
  });
});
