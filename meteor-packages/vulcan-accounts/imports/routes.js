import { addRoute } from 'meteor/vulcan:core';

addRoute({name: 'resetPassword', path: '/reset-password/:token', componentName: 'AccountsResetPassword'});
addRoute({name: 'enrollAccount', path: '/enroll-account/:token', componentName: 'AccountsEnrollAccount'});
