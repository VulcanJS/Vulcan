AutoForm.addInputType("bootstrap-postthumbnail", {
  template: "afPostThumbnail"
});

var fillEmbedlyData = function (instance) {

  // note: the following fields are *not* in the current template
  var $urlField = $('input[name="url"]');
  var $titleField = $('input[name="title"]');
  var $bodyField = $('textarea[name="body"]');
  var url = $urlField.val();

  var $thumbnailContainer = instance.$('.post-thumbnail-container');
  var $img = instance.$('.post-thumbnail-preview');
  var $thumbnailUrlField = instance.$('[name="thumbnailUrl"]');

  if (!!url) {
    $thumbnailContainer.addClass('loading');
    Messages.clearSeen();
    console.log('getting embedly data for '+url);
    Meteor.call('getEmbedlyData', url, function (error, data) {
      if (error) {
        console.log(error);
        Messages.flash(error.message, 'error');
        $thumbnailContainer.removeClass('loading');
        return;
      }
      if (data) {
        // set thumbnail and fill in thumbnailUrl field
        $img.attr('src', data.thumbnailUrl);
        $thumbnailUrlField.val(data.thumbnailUrl);

        // remove loading class
        $thumbnailContainer.removeClass('loading');

        if (!$titleField.val()) // if title field is empty, fill in title
          $titleField.val(data.title);
        if (!$bodyField.val()) // if body field is empty, fill in body
          $bodyField.val(data.description);

        data.url = url;
        
        Telescope.callbacks.run("afterEmbedlyPrefill", data);

      }
    });
  }
};

Template.afPostThumbnail.created = function () {
  var instance = this;
  instance.embedlyKeyExists = new ReactiveVar(false);
  // embedly key is not published to client, so we need a method to test if it has been provided or not
  Meteor.call('embedlyKeyExists', function (error, result) {
    if (result)
      instance.embedlyKeyExists.set(result);
  });
};

Template.afPostThumbnail.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  },
  outerStyle: function () {
    var thumbnailWidth = Settings.get('thumbnailWidth', 200);
    var thumbnailHeight = Settings.get('thumbnailHeight', 125);
    return "max-width: "+thumbnailWidth+"px; max-height: "+thumbnailHeight+"px;";
  },
  innerStyle: function () {
    var padding = Settings.get('thumbnailHeight', 125) * 100 / Settings.get('thumbnailWidth', 200);
    return "padding-bottom: " + padding + "%";
  },
  embedlyKeyExists: function () {
    // haven't found a better way to do this yet…
    return Template.instance().embedlyKeyExists.get();
  }
});

Template.afPostThumbnail.rendered = function () {

  var instance = this;
  var $urlField = $('[name="url"]');

  $urlField.change(function () {
    fillEmbedlyData(instance);
  });

};

Template.afPostThumbnail.events({
  'click .remove-thumbnail-link': function (e, t) {
    e.preventDefault();
    t.$('.post-thumbnail-preview').attr('src', '');
    t.$('input').val('');
  },
  'click .regenerate-thumbnail-link': function (e, instance) {
    e.preventDefault();
    fillEmbedlyData(instance);
  }
});
