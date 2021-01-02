import expect from 'expect';
import {
  createReactiveState,
  getReactiveState,
  getReactiveStateValue,
  setReactiveStateValue,
  updateReactiveStateValue,
  useReactiveState,
} from "../lib/modules/reactive-state";

// prepare Jest migration
const test = it;

describe('vulcan:lib/reactive-state', function () {

  const scalarStateKey = 'ClickCount';

  const stateKey = 'TestState';
  const schema = {
    stringField: {
      type: String,
      defaultValue: 'One',
    },
    numField: {
      type: Number,
      defaultValue: 1,
    },
    arrayField: {
      type: Array,
      optional: true,
      arrayItem: {
        type: String,
      },
    },
  };
  const schemaKeys = ['stringField', 'numField', 'arrayField', 'arrayField.$'];
  const defaultObject = {
    stringField: 'One',
    numField: 1,
  }

  describe('createReactiveState()', function () {

    it('registers the given scalar state', function () {
      const checkIfStateIsRegistered = () => {
        getReactiveState(scalarStateKey);
      };

      expect(checkIfStateIsRegistered).toThrowError('no reactive state object');

      createReactiveState({ stateKey: scalarStateKey, defaultValue: 0 });
      const receivedState = getReactiveState(scalarStateKey);

      expect(receivedState.stateKey).toEqual(scalarStateKey);
      expect(receivedState.schema).toBeUndefined();
      expect(receivedState.defaultValue).toEqual(0);
      expect(receivedState.reactiveVar()).toEqual(0);
    });

    it('registers the given object state', function () {
      const checkIfStateIsRegistered = () => {
        getReactiveState(stateKey);
      };

      expect(checkIfStateIsRegistered).toThrowError('no reactive state object');

      createReactiveState({stateKey, schema});
      const receivedState = getReactiveState(stateKey);

      expect(receivedState.stateKey).toEqual(stateKey);
      expect(receivedState.schema._schemaKeys).toEqual(schemaKeys);
      expect(receivedState.defaultValue).toMatchObject(defaultObject);
      expect(receivedState.reactiveVar()).toMatchObject(defaultObject);
    });

    it('throws an error for a duplicate key', function () {
      const registerState = () => {
        createReactiveState({stateKey, schema});
      };

      expect(registerState).toThrowError('already a reactive state object');
    });

    it('ignores a duplicate key when the skipDuplicate option is used', function () {
      createReactiveState({stateKey, schema, skipDuplicate: true});
      const receivedState = getReactiveState(stateKey);

      expect(receivedState.stateKey).toEqual(stateKey);
    });

  });

  describe('getReactiveStateValue()', function () {

    it('returns the correct scalar state value', function () {
      const receivedValue = getReactiveStateValue(scalarStateKey);

      expect(receivedValue).toEqual(0);
    });

    it('returns the correct object state value', function () {
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(defaultObject);
    });

    it('throws an error for an invalid state key', function () {
      const getValue = () => {
        return getReactiveStateValue('xyz');
      };

      expect(getValue).toThrowError('no reactive state object');
    });

  });

  describe('setReactiveStateValue()', function () {

    it('resets the state to its default value when no value is passed', function () {
      setReactiveStateValue(stateKey);
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(defaultObject);
    });

    it('sets the state to the given scalar value', function () {
      setReactiveStateValue(scalarStateKey, 11)
      const receivedValue = getReactiveStateValue(scalarStateKey);

      expect(receivedValue).toEqual(11);
    });

    it('sets the state to the given object value', function () {
      const object2 = {
        stringField: 'Two',
        numField: 2,
      }

      setReactiveStateValue(stateKey, object2);
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object2);
    });

    it('cleans the given value before before setting it', function () {
      const object3 = {
        stringField: 'Three',
      }
      const object3Cleaned = {
        stringField: 'Three',
        numField: 1,
      }

      setReactiveStateValue(stateKey, object3)
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object3Cleaned);
    });

  });

  describe('updateReactiveStateValue()', function () {

    it('$sets only the given number field of an object state', function () {
      const object3NumFieldSet = {
        stringField: 'Three',
        numField: 3,
      }

      updateReactiveStateValue(stateKey, {numField: {$set: 3}});
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object3NumFieldSet);
    });

    it('$sets only the given array field of an object state', function () {
      const object3ArrayFieldSet = {
        stringField: 'Three',
        numField: 3,
        arrayField: ['a'],
      }

      updateReactiveStateValue(stateKey, {arrayField: {$set: ['a']}});
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object3ArrayFieldSet);
    });

    it('$pushes elements to the given array field of an object state', function () {
      const object3ArrayFieldPushed = {
        stringField: 'Three',
        numField: 3,
        arrayField: ['a', 'b', 'c'],
      }

      updateReactiveStateValue(stateKey, {arrayField: {$push: ['b', 'c']}});
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object3ArrayFieldPushed);
    });

  });

  describe('useReactiveState()', function () {

    it('returns props including the ReactiveState and functions to set and update it', function () {
      setReactiveStateValue(stateKey); // reset

      const { TestState, setTestState, updateTestState } = useReactiveState({ stateKey });

      expect(TestState.stateKey).toEqual(stateKey);
      expect(TestState.schema._schemaKeys).toEqual(schemaKeys);
      expect(TestState.defaultValue).toMatchObject(defaultObject);
      expect(TestState.reactiveVar()).toMatchObject(defaultObject);

      expect(typeof setTestState).toEqual('function');
      expect(typeof updateTestState).toEqual('function');
    });

    it('returns props with custom names when the propName option is passed', function () {
      const { MyState, setMyState, updateMyState } = useReactiveState({ stateKey, propName: 'MyState' });

      expect(MyState.stateKey).toEqual(stateKey);
      expect(MyState.schema._schemaKeys).toEqual(schemaKeys);
      expect(MyState.defaultValue).toMatchObject(defaultObject);
      expect(MyState.reactiveVar()).toMatchObject(defaultObject);

      expect(typeof setMyState).toEqual('function');
      expect(typeof updateMyState).toEqual('function');
    });

    it('returns a function that allows setting the state', function () {
      const { setMyState } = useReactiveState({ stateKey, propName: 'MyState' });

      const object2 = {
        stringField: 'Two',
        numField: 2,
      }

      setMyState(object2)
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual(object2);
    });

    it('returns a function that allows updating the state', function () {
      const { updateMyState } = useReactiveState({ stateKey, propName: 'MyState' });

      updateMyState({numField: {$set: 10}})
      const receivedValue = getReactiveStateValue(stateKey);

      expect(receivedValue).toEqual({stringField: 'Two', numField: 10});
    });

  });

});
