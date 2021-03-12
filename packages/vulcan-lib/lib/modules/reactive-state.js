/**
 * Simple state management based on Apollo Client reactive variables.
 * @see {@link https://www.apollographql.com/docs/react/local-state/reactive-variables/}
 * Use it to store session data that survives re-renders and router transitions, unlike component state.
 * Register multiple scalar or object states with optional SimpleSchemas for cleaning and validation.
 *
 * @module reactive-state
 */


import {createSchema} from './schema_utils';
import {makeVar} from '@apollo/client';
// eslint-disable-next-line no-unused-vars
import SimpleSchema from 'simpl-schema';
import _forOwn from 'lodash/forOwn';


const reactiveStates = {};


/**
 * An object for storing global state based on Apollo Client reactive variables
 * @typedef {function} ReactiveState
 * @property {string} stateKey - The name/id/key of the state
 * @property {SimpleSchema} [schema] - Optional schema
 * @property {*} [defaultValue] - Optional default value
 * @property {function} reactiveVar - The reactive variable
 */


/**
 * Create a new reactive state
 * @param {string} stateKey The name/id/key for the new reactive state
 * @param {Object|SimpleSchema} [schema] Optional schema definition object that will be converted to `SimpleSchema`
 *   using `createSchema()`
 * @param {*} [defaultValue] Optional default value; alternatively you can define `defaultValue`s in the schema
 * @param {boolean} [skipDuplicate] If you try to create a reactive state with a key that's already used, an exception
 *   will be thrown; use this option to prevent the exception and use the existing state without changing it
 * @returns {ReactiveState} Returns the newly created state object
 * @throws Will throw an error if there is already a reactive state with the given key - unless `skipDuplicates` is `true`
 */
export const createReactiveState = ({stateKey, schema, defaultValue, skipDuplicate}) => {
  if (reactiveStates[stateKey]) {
    if (skipDuplicate) return reactiveStates[stateKey];
    throw new Error(`There is already a reactive state named ${stateKey}`);
  }

  if (schema) {
    schema = createSchema(schema);
    defaultValue = cleanReactiveStateValue(defaultValue || {}, schema);
  }

  const reactiveVar = makeVar(defaultValue);

  const reactiveState = function (updates) {
    let value = reactiveVar();
    if (arguments.length > 0) {
      if (typeof updates === 'function') {
        value = updates(value);
      } else if (typeof value === 'object' && typeof updates === 'object') {
        value = Object.assign({}, value, updates);
      } else if (value === null) {
        value = defaultValue;
      } else {
        value = updates;
      }
      value = cleanReactiveStateValue(value, schema);
      value = reactiveVar(value);
    }
    return value;
  };
  reactiveState.stateKey = stateKey;
  reactiveState.schema = schema;
  reactiveState.defaultValue = defaultValue;
  reactiveState.reactiveVar = reactiveVar;

  reactiveStates[stateKey] = reactiveState;

  return reactiveState;
};


/**
 * Return a reactive state previously created
 * @param {string} stateKey The key of the desired reactive state
 * @returns {ReactiveState}
 * @throws Will throw an error if there is no reactive state with the given key
 */
export const getReactiveState = (stateKey) => {
  const stateObject = reactiveStates[stateKey];
  if (!stateObject) {
    throw new Error(`There is no reactive state with stateKey ${stateKey}`);
  }

  return stateObject;
};


/**
 * Given a value to be stored in state, this functions clones, cleans and validates it
 * @param {Object} value The value object
 * @param {SimpleSchema} [schema] Optional schema for validation
 * @returns {Object} The cleaned value
 */
export const cleanReactiveStateValue = (value, schema) => {
  if (typeof value === 'object') {
    value = {...value};
    if (schema) {
      value = schema.clean(value);
      schema.validate(value);
    }
  }

  return value;
};


/**
 * Resets the value of all reactive states to their defaults
 */
export const resetReactiveState = () => {
  _forOwn(reactiveStates, function (stateObject, stateKey) {
    stateObject(null);
  });
};
