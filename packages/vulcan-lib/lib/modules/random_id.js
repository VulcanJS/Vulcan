export const Random = {};
import range from 'lodash/range';
import sample from 'lodash/sample';

Random.id = function(length = 17) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz';
  return range(length)
    .map(() => sample(chars))
    .join('');
};
