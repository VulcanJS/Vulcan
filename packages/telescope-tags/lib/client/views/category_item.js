Meteor.startup(function () {
  Template[getTemplate('categoryItem')].events({
    'click .edit-link': function(e, instance){
      e.preventDefault();
      var categoryId = instance.data._id;
      var name = $('#name_'+categoryId).val();
      var description = $('#description_'+categoryId).val();
      var order = parseInt($('#order_'+categoryId).val());
      var slug = slugify(name);
      if(name){
        Categories.update(categoryId,{ $set: {name: name, slug: slug, order: order, description: description}});
      }else{
        Categories.remove(categoryId);
      }
    }
  });
});
