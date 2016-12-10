import Telescope from './config.js';
import { compose } from 'react-apollo'; // note: at the moment, compose@react-apollo === compose@redux ; see https://github.com/apollostack/react-apollo/blob/master/src/index.ts#L4-L7

export const Components = {};
// where/how to deal with that?
Telescope.components = {};

/**
 * Register a Telescope component with a name, a raw component than can be extended
 * and one or more optional higher order components.
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
export const registerComponent = (name, rawComponent, ...hocs) => {
  // console.log('// registering component');
  // console.log(name);
  // console.log('raw component', rawComponent);
  // console.log('higher order components', hocs); 

  // compose the raw component with the HOCs given in option
  Components[name] = compose(...hocs)(rawComponent);

  // keep track of the raw component & hocs, so we can extend the component if necessary
  Components[name].rawComponent = rawComponent;
  Components[name].hocs = hocs;

  // ---- to remove later ----
  Telescope.components[name] = compose(...hocs)(rawComponent);

  // keep track of the raw component & hocs, so we can extend the component if necessary
  Telescope.components[name].rawComponent = rawComponent;
  Telescope.components[name].hocs = hocs;
  // -------------------------

  return Components[name];
};

/**
 * Get a component registered with Telescope.registerComponent(name, component, ...hocs).
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} A (wrapped) React component
 */
 export const getComponent = (name) => {
  return Components[name];
};

/**
 * Get the **raw** (original) component registered with Telescope.registerComponent
 * without the possible HOCs wrapping it.
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} An interchangeable/extendable React component
 */
 export const getRawComponent = (name) => {
  return Components[name].rawComponent;
};

/**
 * Replace a Telescope component with the same name with a new component or 
 * an extension of the raw component and one or more optional higher order components.
 * This function keeps track of the previous HOCs and wrap the new HOCs around previous ones
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
 export const replaceComponent = (name, newComponent, ...newHocs) => {
  const previousComponent = Components[name];
  
  // xxx : throw an error if the previous component doesn't exist

  // console.log('// replacing component');
  // console.log(name);
  // console.log(newComponent);
  // console.log('new hocs', newHocs);
  // console.log('previous hocs', previousComponent.hocs);

  return registerComponent(name, newComponent, ...newHocs, ...previousComponent.hocs);  
};

export const copyHoCs = (sourceComponent, targetComponent) => {
  return compose(...sourceComponent.hocs)(targetComponent);
}

Telescope.registerComponent = registerComponent; 
Telescope.getComponent = getComponent; 
Telescope.getRawComponent = getRawComponent; 
Telescope.replaceComponent = replaceComponent; 
Telescope.copyHoCs = copyHoCs; 
