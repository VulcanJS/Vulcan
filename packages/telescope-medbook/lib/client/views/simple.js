Meteor.startup(function () {
  Template[getTemplate('crfs')].helpers({
    crfs: function(){
      return CRFs.find({}, {sort: {order: 1, name: 1}});
    },
    crfItem: function () {
      return getTemplate('crfItem');
    }
  });

  Template[getTemplate('crfs')].events({
    'click input[type=submit]': function(e){
      e.preventDefault();

      var name = $('#name').val();
      var numberOfCRFs = CRFs.find().count();
      var order = parseInt($('#order').val()) || (numberOfCRFs + 1);
      var slug = slugify(name);
      
      Meteor.call('crf', {
        name: name,
        order: order,
        slug: slug
      }, function(error, crfName) {
        if(error){
          console.log(error);
          throwError(error.reason);
          clearSeenErrors();
        }else{
          $('#name').val('');
          // throwError('New crf "'+crfName+'" created');
        }
      });
    }
  });
});
