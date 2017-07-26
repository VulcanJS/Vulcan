import { addProduct } from 'meteor/vulcan:payments';

addProduct('membership', {
  name: 'VulcanJS Membership',
  amount: 10000,
  currency: 'USD',
  description: 'Become a paid member.',
  coupons: {
    VULCAN: 5000,
  }
});