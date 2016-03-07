Template.no_rights.helpers({
  errorMessage: function () {
    return !!this.message ? i18n.t(this.message) : i18n.t("sorry_you_dont_have_the_rights_to_view_this_page");
  }
});