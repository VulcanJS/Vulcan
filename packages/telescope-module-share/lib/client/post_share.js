Template[getTemplate('postShare')].events({
  'click .share-link': function(e){
    console.log('aaa')
    var $this = $(e.target).parents('.post-share').find('.share-link');
    var $share = $this.parents('.post-share').find('.share-options');
    e.preventDefault();
    $('.share-link').not($this).removeClass("active");
    $(".share-options").not($share).addClass("hidden");
    $this.toggleClass("active");
    $share.toggleClass("hidden");
  }
});