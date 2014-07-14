Template[getTemplate('postActions')].helpers({

});

Template[getTemplate('postActions')].events({
  'click .toggle-actions-link': function(e, instance){
    e.preventDefault();
    var $modules = $(e.target).parents('.post').find('.right-modules');
    $modules.toggleClass('visible');
  }
});