AutoForm.addInputType("bootstrap-postthumbnail", {
  template: "afPostThumbnail"
});

Template.afPostThumbnail.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  }
});

Template.afPostThumbnail.rendered = function () {

  var $img = this.$('.post-thumbnail-preview');
  var $thumbnailUrlField = this.$('[name="thumbnailUrl"]');

  // note: the following fields are *not* in the current template
  var $urlField = $('[name="url"]');
  var $titleField = $('[name="title"]');
  var $bodyField = $('[name="body"]');

  $urlField.change(function (e) {
    var url = $urlField.val();
    if (!!url) {
      Meteor.call('getEmbedlyData', url, function (error, data) {
        if (data) {
          $img.attr('src', data.thumbnailUrl);
          $thumbnailUrlField.val(data.thumbnailUrl);
          $titleField.val(data.title);
          $bodyField.val(data.description);
        }
      });
    }
  });
}

