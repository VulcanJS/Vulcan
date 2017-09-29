/*

Default sort

*/

import { Categories } from './collection.js';

Categories.addDefaultView(terms => ({
  options: {
    sort: {
      order: 1
    }
  }
}));