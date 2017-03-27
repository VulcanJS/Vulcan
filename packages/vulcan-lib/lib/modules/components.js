import { compose } from 'react-apollo'; // note: at the moment, compose@react-apollo === compose@redux ; see https://github.com/apollostack/react-apollo/blob/master/src/index.ts#L4-L7

export const Components = {}; // will be populated on startup (see vulcan:routing)
export const ComponentsTable = {} // storage for infos about components

/**
 * Register a Telescope component with a name, a raw component than can be extended
 * and one or more optional higher order components.
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} rawComponent Interchangeable/extendable component.
 * @param {...Function} hocs The HOCs to compose with the raw component.
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 * 
 * @returns Structure of a component in the list:
 *
 * ComponentsTable.Foo = {
 *    name: 'Foo',
 *    hocs: [fn1, fn2],
 *    rawComponent: React.Component,
 *    call: () => compose(...hocs)(rawComponent),
 * }
 *
 */
export const registerComponent = (name, rawComponent, ...hocs) => {
  // console.log('// registering component');
  // console.log(name);
  // console.log('raw component', rawComponent);
  // console.log('higher order components', hocs); 

  // store the component in the table
  ComponentsTable[name] = {
    name,
    rawComponent,
    hocs,
  };
};

/**
 * Get a component registered with registerComponent(name, component, ...hocs).
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} A (wrapped) React component
 */
export const getComponent = (name) => {
  const component = ComponentsTable[name];
  if (!component) {
    throw new Error(`Component ${name} not registered.`)
  }
  const hocs = component.hocs.map(hoc => Array.isArray(hoc) ? hoc[0](hoc[1]) : hoc);
  return compose(...hocs)(component.rawComponent)
};

/**
 * Populate the lookup table for components to be callable
 * ℹ️ Called once on app startup
 **/
export const populateComponentsApp = () => {
  // loop over each component in the list
  Object.keys(ComponentsTable).map(name => {
    
    // populate an entry in the lookup table
    Components[name] = getComponent(name);
    
    // uncomment for debug
    // console.log('init component:', name);
  });
}

/**
 * Get the **raw** (original) component registered with registerComponent
 * without the possible HOCs wrapping it.
 *
 * @param {String} name The name of the component to get.
 * @returns {Function|React Component} An interchangeable/extendable React component
 */
 export const getRawComponent = (name) => {
  return ComponentsTable[name].rawComponent;
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
  const previousComponent = ComponentsTable[name];
  
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
