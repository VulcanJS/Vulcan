import expect from 'expect';
import {
  mergeDefaultBackofficeOptions,
  mergeDefaultCollectionOptions,
} from '../lib/modules/options';
describe('options', function () {
  it('merge defaultOptions', function () {
    const givenOptions = {
      menuItem: { groups: ['members', 'admins', 'foobars'] },
    };
    const mergedOptions = mergeDefaultBackofficeOptions(givenOptions);
    expect(mergedOptions.menuItem.groups).toEqual(['members', 'admins', 'foobars']);
  });
});
