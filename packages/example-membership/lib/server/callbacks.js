import { addCallback } from 'meteor/vulcan:core';

function makeCustomer (modifier, user, charge) {
  modifier.$set.groups = modifier.$set.groups ? [...user.groups, 'customers'] : ['customers'];
  return modifier;
}

addCallback('users.charge.sync', makeCustomer);