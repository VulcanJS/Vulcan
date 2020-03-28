import expect from 'expect';
import { filterFunction } from '../lib/modules/mongoParams';
import { createDummyCollection } from 'meteor/vulcan:test';

const test = it;

describe('vulcan:lib/mongoParams', () => {
  test('keep multiple filters', async () => {
    const filter = {
      _id: { _gte: 1, _lte: 5 },
    };
    const input = {
      filter,
    };
    const expectedFilter = { _id: { $gte: 1, $lte: 5 } };
    const mongoParams = await filterFunction(createDummyCollection({}), input);
    expect(mongoParams.selector).toEqual(expectedFilter);
  });
  describe('boolean operators', () => {
    const collection = createDummyCollection({
      schema: {
        _id: {
          type: String,
          canRead: ['admins'],
        },
        name: {
          type: String,
          canRead: ['admins'],
        },
        length: {
          type: Number,
          canRead: ['admins'],
        },
      },
    });
    test('handle _and at root', async () => {
      const filter = {
        _and: [{ name: { _gte: 'A' } }, { length: { _lte: 2 } }],
      };
      const input = {
        filter,
      };
      const expectedFilter = { $and: [{ name: { $gte: 'A' } }, { length: { $lte: 2 } }] };
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });
  });
});
