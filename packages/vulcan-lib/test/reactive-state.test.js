import expect from 'expect';
import {createReactiveState, getReactiveState} from "../lib/modules/reactive-state";


describe('vulcan:lib/reactive-state', function () {

  const scalarStateKey = 'clickCount';
  let scalarState;

  const stateKey = 'testState';
  let objectState;
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

      expect(checkIfStateIsRegistered).toThrowError('no reactive state');

      scalarState = createReactiveState({ stateKey: scalarStateKey, defaultValue: 0 });

      expect(typeof scalarState).toEqual('function');
      expect(scalarState()).toEqual(0);
      expect(typeof scalarState.reactiveVar).toEqual('function');
      expect(scalarState.reactiveVar()).toEqual(0);
      expect(scalarState.stateKey).toEqual(scalarStateKey);
      expect(scalarState.schema).toBeUndefined();
      expect(scalarState.defaultValue).toEqual(0);
    });

    it('registers the given object state', function () {
      const checkIfStateIsRegistered = () => {
        getReactiveState(stateKey);
      };

      expect(checkIfStateIsRegistered).toThrowError('no reactive state');

      objectState = createReactiveState({stateKey, schema});

      expect(typeof objectState).toEqual('function');
      expect(objectState()).toMatchObject(defaultObject);
      expect(typeof objectState.reactiveVar).toEqual('function');
      expect(objectState.reactiveVar()).toMatchObject(defaultObject);
      expect(objectState.stateKey).toEqual(stateKey);
      expect(objectState.schema._schemaKeys).toEqual(schemaKeys);
      expect(objectState.defaultValue).toMatchObject(defaultObject);
      expect(objectState()).toMatchObject(defaultObject);
    });

    it('throws an error for a duplicate key', function () {
      const registerState = () => {
        createReactiveState({stateKey, schema});
      };

      expect(registerState).toThrowError('already a reactive state');
    });

    it('ignores a duplicate key when the skipDuplicate option is used', function () {
      const receivedState = createReactiveState({stateKey, schema, skipDuplicate: true});

      expect(receivedState.stateKey).toEqual(stateKey);
    });

  });

  describe('get ReactiveState value', function () {

    it('returns the correct scalar state value', function () {
      expect(scalarState()).toEqual(0);
    });

    it('returns the correct object state value', function () {
      expect(objectState()).toEqual(defaultObject);
    });

  });

  describe('setting ReactiveState value', function () {

    it('resets the state to its default value when null is passed', function () {
      objectState(null);
      const receivedValue = objectState();

      expect(receivedValue).toEqual(defaultObject);
    });

    it('sets the state to the given scalar value', function () {
      scalarState(11);
      const receivedValue = scalarState();

      expect(receivedValue).toEqual(11);
    });

    it('sets the state to the given object value', function () {
      const object2 = {
        stringField: 'Two',
        numField: 2,
      }

      objectState(object2);
      const receivedValue = objectState();

      expect(receivedValue).toEqual(object2);
    });

    it('sets only the given number field of an object state', function () {
      const object3NumFieldSet = {
        stringField: 'Two',
        numField: 3,
      }

      objectState({numField: 3});
      const receivedValue = objectState();

      expect(receivedValue).toEqual(object3NumFieldSet);
    });

    it('sets only the given array field of an object state', function () {
      const object3ArrayFieldSet = {
        stringField: 'Two',
        numField: 3,
        arrayField: ['a'],
      }

      objectState({arrayField: ['a']});
      const receivedValue = objectState();

      expect(receivedValue).toEqual(object3ArrayFieldSet);
    });

    it('allows updating the value of an object state using a function', function () {
      const object3ArrayFieldPushed = {
        stringField: 'Two',
        numField: 3,
        arrayField: ['a', 'b', 'c'],
      }

      objectState(value => {
        value.arrayField.push('b', 'c');
        return value;
      });
      const receivedValue = objectState();

      expect(receivedValue).toEqual(object3ArrayFieldPushed);
    });

  });

  /*describe('useReactiveState()', function () {

    it('returns props including the ReactiveState and functions to set and update it', function () {
      objectState(null); // reset

      const { testState } = useReactiveState({ stateKey });

      expect(typeof testState).toEqual('function');
      expect(testState.stateKey).toEqual(stateKey);
      expect(testState.schema._schemaKeys).toEqual(schemaKeys);
      expect(testState.defaultValue).toMatchObject(defaultObject);
      expect(testState()).toMatchObject(defaultObject);
    });

    it('returns props with custom names when the propName option is passed', function () {
      const { MyState } = useReactiveState({ stateKey, propName: 'MyState' });

      expect(typeof MyState).toEqual('function');
      expect(MyState.stateKey).toEqual(stateKey);
      expect(MyState.schema._schemaKeys).toEqual(schemaKeys);
      expect(MyState.defaultValue).toMatchObject(defaultObject);
      expect(MyState()).toMatchObject(defaultObject);
    });

    it('returns a function that allows setting the state', function () {
      const { MyState } = useReactiveState({ stateKey, propName: 'MyState' });

      const object2 = {
        stringField: 'Two',
        numField: 2,
      }

      MyState(object2)
      const receivedValue = MyState();

      expect(receivedValue).toEqual(object2);
    });

  });*/

});
