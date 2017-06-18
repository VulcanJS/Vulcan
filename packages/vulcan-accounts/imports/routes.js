import { addRoute } from 'meteor/vulcan:core';

addRoute({name: 'resetPassword', path: '/reset-password/:token', componentName: 'AccountsResetPassword'});
