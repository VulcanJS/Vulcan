AutoForm.addInputType("bootstrap-url", {
  template: "afBootstrapUrl",
  valueIn: function () {
    // console.log(this)
  },
  valueOut: function () {
    var url = this.val();
    if(!!url)
      return (url.substring(0, 7) == "http://" || url.substring(0, 8) == "https://") ? url : "http://"+url;
  }
});

Template.afBootstrapUrl_bootstrap3.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  }
});

