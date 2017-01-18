import update from 'immutability-helper';
import { sortedIndex, findIndex } from 'underscore';

update.extend('$addToSetByIdOrdered', function({ item, sort }, set) {
  // First remove the item
  const setWithoutItem = update(set, { $removeFromSetById: item });

  // Now find where to put it
  const index = sortedIndex(setWithoutItem, item, sort);
  return update(setWithoutItem, { $splice: [[index, 0, item]] });
});

update.extend('$removeFromSetById', function(item, set) {
  const index = findIndex(set, ['id', item.id]);

  if (index === -1) {
    return set;
  } else {
    return update(set, { $splice: [[index, 1]] });
  }
});


export default update;