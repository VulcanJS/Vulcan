Template.footer.helpers({
  footerClass: function(){
    var position = Session.get('isPostsList') ? 'absolute' : 'static';
    return "footer " + position;
  }
});
