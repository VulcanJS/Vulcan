Meteor.startup(() => {
  console.log(typeof Accounts);
  if (typeof Accounts !== 'undefined') {
    Accounts.urls.resetPassword = token => Meteor.absoluteUrl(`reset-password/${token}`);
    Accounts.urls.enrollAccount = token => Meteor.absoluteUrl(`enroll-account/${token}`);
  }
});
