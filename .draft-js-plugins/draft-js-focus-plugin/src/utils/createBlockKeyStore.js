import { List } from 'immutable';

const createBlockKeyStore = () => {
  let keys = List();

  const add = (key) => {
    keys = keys.push(key);
    return keys;
  };

  const remove = (key) => {
    keys = keys.filter((item) => item !== key);
    return keys;
  };

  return {
    add,
    remove,
    includes: (key) => keys.includes(key),
    getAll: () => keys,
  };
};

export default createBlockKeyStore;
