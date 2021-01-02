/**
 * Simple state management based on Apollo Client reactive variables exposed as React HoCs and Hooks.
 * Use it to store session data that survives re-renders and router transitions, unlike component state.
 * Register multiple state objects with optional SimpleSchemas for cleaning and validation.
 * @see {@link https://www.apollographql.com/docs/react/local-state/reactive-variables/}
 *
 * @module reactive-state
 */


import PropTypes from 'prop-types';
import React from 'react';
import {createSchema} from './schema_utils';
import {makeVar} from '@apollo/client';
import update from 'immutability-helper';
// eslint-disable-next-line no-unused-vars
import SimpleSchema from 'simpl-schema';
import _forOwn from 'lodash/forOwn';


const reactiveStates = {};


/**
 * An object for storing global state based on Apollo Client reactive variables
 * @typedef {Object} ReactiveState
 * @property {string} stateKey - The name/id/key of the state
 * @property {SimpleSchema} [schema] - Optional schema
 * @property {Object} [defaultValue] - Optional default value
 * @property {function} reactiveVar - The reactive variable
 */

/**
 * Create a new reactive state object
 * @param {string} stateKey The name/id/key for the new reactive state
 * @param {Object} [schema] Optional schema definition object that will be converted to `SimpleSchema` using `createSchema()`
 * @param {Object} [defaultValue] Optional default value; alternatively you can define `defaultValue`s in the schema
 * @param {boolean} [skipDuplicate] If you try to create a reactive state with a key that's already used, an exception will
 * be thrown; use this option to prevent the exception and use the existing state without changing it
 * @returns {ReactiveState} Returns the newly created state object
 * @throws Will throw an error if there is already a reactive state object with the given key - unless `skipDuplicates` is `true`
 */
export const createReactiveState = ({stateKey, schema, defaultValue, skipDuplicate}) => {
  if (reactiveStates[stateKey]) {
    if (skipDuplicate) return;
    throw new Error(`There is already a reactive state object named ${stateKey}`);
  }

  if (schema) {
    schema = createSchema(schema);
    defaultValue = cleanReactiveStateValue(defaultValue || {}, schema);
  }

  reactiveStates[stateKey] = {
    stateKey,
    schema,
    defaultValue,
    reactiveVar: makeVar(defaultValue),
  };

  return getReactiveState(stateKey);
};


/**
 * Return a reactive state object previously created
 * @param {string} stateKey The key of the desired reactive state
 * @returns {ReactiveState}
 * @throws Will throw an error if there is no reactive state object with the given key
 */
export const getReactiveState = (stateKey) => {
  const stateObject = reactiveStates[stateKey];
  if (!stateObject) {
    throw new Error(`There is no reactive state object with stateKey ${stateKey}`);
  }

  return stateObject;
};


/**
 * Return the value currently stored in a reactive state object
 * @param {string} stateKey The key of the desired reactive state
 * @returns {Object}
 * @throws Will throw an error if there is no reactive state object with the given key
 */
export const getReactiveStateValue = (stateKey) => {
  const stateObject = getReactiveState(stateKey);
  return stateObject.reactiveVar();
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
 * Sets the reactive state with the given key to the given value; replaces any previous value stored in the state;
 * if you omit value, it will be reset to its original default value
 * @param {string} stateKey The key of the desired reactive state
 * @param {Object} [value] The value to set the reactive state to
 * @return {Object} The new value of the reactive state
 */
export const setReactiveStateValue = (stateKey, value) => {
  const stateObject = getReactiveState(stateKey);
  value = cleanReactiveStateValue(value || stateObject.defaultValue, stateObject.schema);

  stateObject.reactiveVar(value);
  return stateObject.reactiveVar();
};


/**
 * Updates the reactive state using immutability-helper
 * @see {@link https://github.com/kolodny/immutability-helper)
 *
 * @example Add an element to an array field
 *  updateReactiveStateValue('StarWars', { characters: { $push: ['Mayfeld'] } });
 *
 * @param {string} stateKey The key of the desired reactive state
 * @param {Object} updates The updates to apply to the current state
 * @return {Object} The new value of the reactive state
 */
export const updateReactiveStateValue = (stateKey, updates) => {
  const stateObject = getReactiveState(stateKey);
  let value = stateObject.reactiveVar();

  if (typeof value === 'object' && typeof updates === 'object') {
    value = update(value, updates);
  }

  return setReactiveStateValue(stateKey, value);
};


/**
 * Resets the value of all reactive states to their defaults
 */
export const resetReactiveState = () => {
  _forOwn(reactiveStates, function (stateObject, stateKey) {
    setReactiveStateValue(stateKey);
  });
};


/**
 * React hook for using reactive state in a functional component
 * @param {Object} options - Hook options
 *        {string} options.stateKey - The key of the desired reactive state
 *        {string} options.[propName] - Name of the props injected by the hook; omit to use `stateKey`; this is
 *        useful if your code needs to work with various states without knowing their keys
 * @returns {Object} props - Props returned by the hook; the name of the props will be based on `stateKey` or
 * `propName` (`StateName` is just an example)
 * @returns {ReactiveState} props.StateName - The reactive state
 * @returns {function} props.setStateName - A function to set the state
 * @returns {function} props.updateStateName - A function to update the state
 */
export const useReactiveState = (options) => {
  const {stateKey, propName = stateKey} = options;
  const stateObject = getReactiveState(stateKey);

  const props = {
    [propName]: stateObject,
    [`set${propName}`]: function (value) {
      return setReactiveStateValue(stateKey, value);
    },
    [`update${propName}`]: function (updates) {
      return updateReactiveStateValue(stateKey, updates);
    },
  };

  return props;
};


/**
 * React HoC for using reactive state in a Class component
 * @param {Object} options Hook options
 *        {string} options.stateKey The key of the desired reactive state
 *        {string} options.[propName] Name of the props injected by the hook; omit to use `stateKey`
 * @returns {function} A wrapped React component that includes the props returned by `useReactiveState`
 */
export const withReactiveState = (options) => C => {
  const Wrapper = props => {
    const reactiveStateProps = useReactiveState(options);
    return (
      <C {...props} {...reactiveStateProps}/>
    );
  };

  Wrapper.propTypes = {
    options: PropTypes.shape({
      stateKey: PropTypes.string,
    }),
  };

  Wrapper.displayName = 'withReactiveState';

  return Wrapper;
};
