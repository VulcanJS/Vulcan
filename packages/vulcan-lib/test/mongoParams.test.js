import expect from 'expect';
import {filterFunction} from '../lib/modules/mongoParams';
import {createDummyCollection, initServerTest} from 'meteor/vulcan:test';

const test = it;

const mayTheFourth = new Date('1977-05-04T22:00:00');
const summerSolstice = new Date('1972-06-20T12:41:00');

describe('vulcan:lib/mongoParams', function () {

  let collection;

  before(async function () {
    collection = createDummyCollection({
      schema: {
        _id: {
          type: String,
          canRead: ['admins'],
        },
        name: {
          type: String,
          canRead: ['admins'],
        },
        age: {
          type: Number,
          canRead: ['admins'],
        },
        withTheForce: {
          type: Boolean,
          canRead: ['admins'],
        },
        birthday: {
          type: Date,
          canRead: ['admins'],
        },
        friends: {
          type: Array,
          canRead: ['admins'],
        },
        'friends.$': {
          type: String,
          canRead: ['admins'],
        },
        agesOfFriends: {
          type: Array,
          canRead: ['admins'],
        },
        'agesOfFriends.$': {
          type: Number,
          canRead: ['admins'],
        },
        scores: {
          type: Array,
          canRead: ['admins'],
        },
        'scores.$': {
          type: Number,
          canRead: ['admins'],
        },
        forcesOfFriends: {
          type: Array,
          canRead: ['admins'],
        },
        'forcesOfFriends.$': {
          type: Number,
          canRead: ['admins'],
        },
        birthdaysOfFriends: {
          type: Array,
          canRead: ['admins'],
        },
        'birthdaysOfFriends.$': {
          type: Number,
          canRead: ['admins'],
        },
        scores: {
          type: Array,
          canRead: ['admins'],
        },
        'scores.$': {
          type: Number,
          canRead: ['admins'],
        },
        forcesOfFriends: {
          type: Array,
          canRead: ['admins'],
        },
        'forcesOfFriends.$': {
          type: Number,
          canRead: ['admins'],
        },
        birthdaysOfFriends: {
          type: Array,
          canRead: ['admins'],
        },
        'birthdaysOfFriends.$': {
          type: Number,
          canRead: ['admins'],
        },
      },
      results: [{
        _id: "1", name: 'Han', age: 140, withTheForce: false,
        birthday: summerSolstice, friends: ['Leia', 'Luke'], scores: [1.1, 1.2],
      }, {
        _id: "2", name: 'Leia', age: 120, withTheForce: true,
        birthday: mayTheFourth, friends: ['Luke'], scores: [1.1],
      }, {
        _id: "3", name: 'Luke', age: 100, withTheForce: true,
        birthday: mayTheFourth, friends: ['Leia'], scores: [1.2],
      }, {
        _id: "4", name: 'Obi-Wan', age: null, withTheForce: true,
        birthday: new Date('1496-05-04T22:00:00'),
      },
      ]
    });
  })

  describe('string selector', async function () {

    test('string selector _eq', async function () {
      const input = {
        filter: {
          name: {_eq: 'Han'},
        }
      };
      const expectedFilter = {name: {$eq: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _gt', async function () {
      const input = {
        filter: {
          name: {_gt: 'Han'},
        }
      };
      const expectedFilter = {name: {$gt: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _gte', async function () {
      const input = {
        filter: {
          name: {_gte: 'Han'},
        }
      };
      const expectedFilter = {name: {$gte: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _in', async function () {
      const input = {
        filter: {
          name: {_in: ['Luke', 'Han']},
        }
      };
      const expectedFilter = {name: {$in: ['Luke', 'Han']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _nin', async function () {
      const input = {
        filter: {
          name: {_nin: ['Han', 'Leia']},
        }
      };
      const expectedFilter = {name: {$nin: ['Han', 'Leia']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _is_null', async function () {
      const input = {
        filter: {
          name: {_is_null: true},
        }
      };
      const expectedFilter = {name: {$exists: false}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _like', async function () {
      const input = {
        filter: {
          name: {_like: '^e'},
        }
      };
      const expectedFilter = {name: {$regex: '\\^e', $options: 'i'}};
      const mongoParams = await filterFunction(collection, input);
      console.log('mongoParams.selector', mongoParams.selector);
      console.log('expectedFilter', expectedFilter);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _lt', async function () {
      const input = {
        filter: {
          name: {_lt: 'Han'},
        }
      };
      const expectedFilter = {name: {$lt: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _lte', async function () {
      const input = {
        filter: {
          name: {_lte: 'Han'},
        }
      };
      const expectedFilter = {name: {$lte: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string selector _neq', async function () {
      const input = {
        filter: {
          name: {_neq: 'Han'},
        }
      };
      const expectedFilter = {name: {$ne: 'Han'}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('string array selector', async function () {

    test('string array selector _in', async function () {
      const input = {
        filter: {
          friends: {_in: ['Luke', 'Han']},
        }
      };
      const expectedFilter = {friends: {$in: ['Luke', 'Han']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string array selector _nin', async function () {
      const input = {
        filter: {
          friends: {_nin: ['Luke', 'Han']},
        }
      };
      const expectedFilter = {friends: {$nin: ['Luke', 'Han']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string array selector _contains', async function () {
      const input = {
        filter: {
          friends: {_contains: 'Han'},
        }
      };
      const expectedFilter = {friends: {$elemMatch: {$eq: 'Han'}}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('string array selector _contains_all', async function () {
      const input = {
        filter: {
          friends: {_contains_all: ['Leia', 'Luke']},
        }
      };
      const expectedFilter = {friends: {$all: ['Leia', 'Luke']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('int selector', async function () {

    test('int selector _eq', async function () {
      const input = {
        filter: {
          age: {_eq: 100},
        }
      };
      const expectedFilter = {age: {$eq: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _gt', async function () {
      const input = {
        filter: {
          age: {_gt: 100},
        }
      };
      const expectedFilter = {age: {$gt: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _gte', async function () {
      const input = {
        filter: {
          age: {_gte: 100},
        }
      };
      const expectedFilter = {age: {$gte: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _in', async function () {
      const input = {
        filter: {
          age: {_in: [100, 120]},
        }
      };
      const expectedFilter = {age: {$in: [100, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _nin', async function () {
      const input = {
        filter: {
          age: {_nin: [100, 120]},
        }
      };
      const expectedFilter = {age: {$nin: [100, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _is_null', async function () {
      const input = {
        filter: {
          age: {_is_null: true},
        }
      };
      const expectedFilter = {age: {$exists: false}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _lt', async function () {
      const input = {
        filter: {
          age: {_lt: 120},
        }
      };
      const expectedFilter = {age: {$lt: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _lte', async function () {
      const input = {
        filter: {
          age: {_lte: 120},
        }
      };
      const expectedFilter = {age: {$lte: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int selector _neq', async function () {
      const input = {
        filter: {
          age: {_neq: 120},
        }
      };
      const expectedFilter = {age: {$ne: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('int array selector', async function () {

    test('int array selector _in', async function () {
      const input = {
        filter: {
          agesOfFriends: {_in: [110, 120]},
        }
      };
      const expectedFilter = {agesOfFriends: {$in: [110, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int array selector _nin', async function () {
      const input = {
        filter: {
          agesOfFriends: {_nin: [110, 120]},
        }
      };
      const expectedFilter = {agesOfFriends: {$nin: [110, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int array selector _contains', async function () {
      const input = {
        filter: {
          agesOfFriends: {_contains: 110},
        }
      };
      const expectedFilter = {agesOfFriends: {$elemMatch: {$eq: 110}}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('int array selector _contains_all', async function () {
      const input = {
        filter: {
          agesOfFriends: {_contains_all: [110, 120]},
        }
      };
      const expectedFilter = {agesOfFriends: {$all: [110, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('float selector', async function () {

    test('float selector _eq', async function () {
      const input = {
        filter: {
          age: {_eq: 100},
        }
      };
      const expectedFilter = {age: {$eq: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _gt', async function () {
      const input = {
        filter: {
          age: {_gt: 100},
        }
      };
      const expectedFilter = {age: {$gt: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _gte', async function () {
      const input = {
        filter: {
          age: {_gte: 100},
        }
      };
      const expectedFilter = {age: {$gte: 100}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _in', async function () {
      const input = {
        filter: {
          age: {_in: [100, 120]},
        }
      };
      const expectedFilter = {age: {$in: [100, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _nin', async function () {
      const input = {
        filter: {
          age: {_nin: [100, 120]},
        }
      };
      const expectedFilter = {age: {$nin: [100, 120]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _is_null', async function () {
      const input = {
        filter: {
          age: {_is_null: true},
        }
      };
      const expectedFilter = {age: {$exists: false}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _lt', async function () {
      const input = {
        filter: {
          age: {_lt: 120},
        }
      };
      const expectedFilter = {age: {$lt: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _lte', async function () {
      const input = {
        filter: {
          age: {_lte: 120},
        }
      };
      const expectedFilter = {age: {$lte: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float selector _neq', async function () {
      const input = {
        filter: {
          age: {_neq: 120},
        }
      };
      const expectedFilter = {age: {$ne: 120}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('float array selector', async function () {

    test('float array selector _in', async function () {
      const input = {
        filter: {
          scores: {_in: [1.1, 1.2]},
        }
      };
      const expectedFilter = {scores: {$in: [1.1, 1.2]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float array selector _nin', async function () {
      const input = {
        filter: {
          scores: {_nin: [1.1, 1.2]},
        }
      };
      const expectedFilter = {scores: {$nin: [1.1, 1.2]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float array selector _contains', async function () {
      const input = {
        filter: {
          scores: {_contains: 1.1},
        }
      };
      const expectedFilter = {scores: {$elemMatch: {$eq: 1.1}}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('float array selector _contains_all', async function () {
      const input = {
        filter: {
          scores: {_contains_all: [1.1, 1.2]},
        }
      };
      const expectedFilter = {scores: {$all: [1.1, 1.2]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('boolean selector', async function () {

    test('boolean selector _eq', async function () {
      const input = {
        filter: {
          withTheForce: {_eq: true},
        }
      };
      const expectedFilter = {withTheForce: {$eq: true}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('boolean selector _neq', async function () {
      const input = {
        filter: {
          withTheForce: {_neq: true},
        }
      };
      const expectedFilter = {withTheForce: {$ne: true}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('boolean array selector', async function () {

    test('boolean array selector _contains', async function () {
      const input = {
        filter: {
          forcesOfFriends: {_contains: true},
        }
      };
      const expectedFilter = {forcesOfFriends: {$elemMatch: {$eq: true}}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('date selector', async function () {

    test('date selector _eq', async function () {
      const input = {
        filter: {
          birthday: {_eq: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$eq: mayTheFourth }};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _gt', async function () {
      const input = {
        filter: {
          birthday: {_gt: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$gt: mayTheFourth}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _gte', async function () {
      const input = {
        filter: {
          birthday: {_gte: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$gte: mayTheFourth}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _in', async function () {
      const input = {
        filter: {
          birthday: {_in: [mayTheFourth, summerSolstice]},
        }
      };
      const expectedFilter = {birthday: {$in: [mayTheFourth, summerSolstice]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _nin', async function () {
      const input = {
        filter: {
          birthday: {_nin: [mayTheFourth, summerSolstice]},
        }
      };
      const expectedFilter = {birthday: {$nin: [mayTheFourth, summerSolstice]}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _is_null', async function () {
      const input = {
        filter: {
          birthday: {_is_null: true},
        }
      };
      const expectedFilter = {birthday: {$exists: false}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _lt', async function () {
      const input = {
        filter: {
          birthday: {_lt: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$lt: mayTheFourth}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _lte', async function () {
      const input = {
        filter: {
          birthday: {_lte: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$lte: mayTheFourth}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date selector _neq', async function () {
      const input = {
        filter: {
          birthday: {_neq: mayTheFourth},
        }
      };
      const expectedFilter = {birthday: {$ne: mayTheFourth}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('date array selector', async function () {

    test('date array selector _contains', async function () {
      const input = {
        filter: {
          birthdaysOfFriends: {_contains: mayTheFourth},
        }
      };
      const expectedFilter = {birthdaysOfFriends: {$elemMatch: {$eq: mayTheFourth}}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('date array selector _contains_all', async function () {
      const input = {
        filter: {
          birthdaysOfFriends: {_contains_all: ['Leia', 'Luke']},
        }
      };
      const expectedFilter = {birthdaysOfFriends: {$all: ['Leia', 'Luke']}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

  describe('complex selectors', () => {

    test('handle multiple filters', async () => {
      const filter = {
        _id: {_gte: 1, _lte: 5},
      };
      const input = {
        filter,
      };
      const expectedFilter = {_id: {$gte: 1, $lte: 5}};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

    test('handle _and at root', async () => {
      const filter = {
        _and: [{name: {_gte: 'A'}}, {age: {_lte: 2}}],
      };
      const input = {
        filter,
      };
      const expectedFilter = {$and: [{name: {$gte: 'A'}}, {age: {$lte: 2}}]};
      const mongoParams = await filterFunction(collection, input);
      expect(mongoParams.selector).toEqual(expectedFilter);
    });

  });

});
