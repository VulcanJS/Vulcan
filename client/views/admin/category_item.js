Template.category_item.events({
  'click .edit-link': function(e, instance){
    e.preventDefault();
    var categoryId=instance.data._id;
    var name= $('#name_'+categoryId).val();
    if(name){
      Categories.update(categoryId,{ $set: {name: name}});
    }else{
      Categories.remove(categoryId);
    }
  }
})