Accounts.urls.resetPassword = (token) => Meteor.absoluteUrl(`reset-password/${token}`);
Accounts.urls.enrollAccount = (token) => Meteor.absoluteUrl(`enroll-account/${token}`);
