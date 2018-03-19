import { addRoute } from 'meteor/vulcan:core';

addRoute([
  {name:'checkoutTest', path: '/checkout-test', componentName: 'Checkout', layoutName: 'AdminLayout'},
  {name:'chargesDashboard', path: '/charges', componentName: 'ChargesDashboard', layoutName: 'AdminLayout'},
]);
