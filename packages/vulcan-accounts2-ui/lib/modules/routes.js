import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'login', path: '/login', componentName: 'AccountsLogin' });
addRoute({ name: 'register', path: '/register', componentName: 'AccountsRegister' });
addRoute({ name: 'forgotPassword', path: '/forgot-password', componentName: 'AccountsForgotPassword' });
addRoute({ name: 'changePassword', path: '/change-password', componentName: 'AccountsChangePassword' });
addRoute({ name: 'emailVerification', path: '/email-verification', componentName: 'AccountsEmailVerification' });
