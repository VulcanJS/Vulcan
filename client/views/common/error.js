Template[getTemplate('error')].helpers({
  error_item: function () {
    return getTemplate('error_item');
  },
  errors: function(){
    return Errors.find({show: true});
  }
});