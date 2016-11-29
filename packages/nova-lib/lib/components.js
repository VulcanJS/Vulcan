import Telescope from './config.js';
import { compose } from 'react-apollo'; // note: at the moment, compose@react-apollo === compose@redux ; see https://github.com/apollostack/react-apollo/blob/master/src/index.ts#L4-L7

Telescope.components = {};

/**
 * Register a Telescope component with a name, a raw component than can be extended
 * and one or more optional higher order components.
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Telescope.components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
Telescope.registerComponent = (name, rawComponent, ...hocs) => {
  // console.log('// registering component');
  // console.log(name);
  // console.log('raw component', rawComponent);
  // console.log('higher order components', hocs); 

  // note: maybe do something to replace connect at the right place, see https://github.com/apollostack/react-apollo/issues/315

  // compose the raw component with the HOCs given in option
  Telescope.components[name] = compose(...hocs)(rawComponent);

  // keep track of the raw component & hocs, so we can extend the component if necessary
  Telescope.components[name].rawComponent = rawComponent;
  Telescope.components[name].hocs = hocs;

  return Telescope.components[name];
};

/**
 * Get a component registered with Telescope.registerComponent(name, component, ...hocs).
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} A (wrapped) React component
 */
Telescope.getComponent = (name) => {
  return Telescope.components[name];
};

/**
 * Get the **raw** (original) component registered with Telescope.registerComponent
 * without the possible HOCs wrapping it.
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} An interchangeable/extendable React component
 */
Telescope.getRawComponent = (name) => {
  return Telescope.components[name].rawComponent;
};

/**
 * Replace a Telescope component with the same name with a new component or 
 * an extension of the raw component and one or more optional higher order components.
 * This function keeps track of the previous HOCs and wrap the new HOCs around previous ones
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Telescope.components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
Telescope.replaceComponent = (name, newComponent, ...newHocs) => {
  const previousComponent = Telescope.components[name];
  
  // xxx : throw an error if the previous component doesn't exist

  // console.log('// replacing component');
  // console.log(name);
  // console.log(newComponent);
  // console.log('new hocs', newHocs);
  // console.log('previous hocs', previousComponent.hocs);

  return Telescope.registerComponent(name, newComponent, ...newHocs, ...previousComponent.hocs);  
}
