templates["afterDay"] = "banner";

Template.banner.helpers({
  isThirdDay: function () {
    return this.index == 2;
  }
});