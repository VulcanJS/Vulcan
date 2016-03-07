Template.user_password.helpers({
  isUsingPassword: function  () {
    return !!this.services.password
  }
});