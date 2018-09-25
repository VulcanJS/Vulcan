import { compose } from 'react-apollo'; // note: at the moment, compose@react-apollo === compose@redux ; see https://github.com/apollostack/react-apollo/blob/master/src/index.ts#L4-L7
import React from 'react';

export const Components = {}; // will be populated on startup (see vulcan:routing)
export const ComponentsTable = {} // storage for infos about components

/**
 * Register a Vulcan component with a name, a raw component than can be extended
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
export function registerComponent(name, rawComponent, ...hocs) {
  // support single-argument syntax
  if (typeof arguments[0] === 'object') {
    // note: cannot use `const` because name, components, hocs are already defined
    // as arguments so destructuring cannot work
    // eslint-disable-next-line no-redeclare
    var { name, component, hocs = [] } = arguments[0];
    rawComponent = component
  }
  // store the component in the table
  ComponentsTable[name] = {
    name,
    rawComponent,
    hocs,
  }
}

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
  if (component.hocs) {
    const hocs = component.hocs.map(hoc => {
      if(!Array.isArray(hoc)) return hoc;
      const [actualHoc, ...args] = hoc;
      return actualHoc(...args);
    });
    return compose(...hocs)(component.rawComponent);
  } else {
    return component.rawComponent;
  }
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
 * Replace a Vulcan component with the same name with a new component or 
 * an extension of the raw component and one or more optional higher order components.
 * This function keeps track of the previous HOCs and wrap the new HOCs around previous ones
 *
 * @param {String} name The name of the component to register.
 * @param {React Component} newComponent Interchangeable/extendable component.
 * @param {...Function} newHocs The HOCs to compose with the raw component.
 * @returns {Function|React Component} A component callable with Components[name]
 *
 * Note: when a component is registered without higher order component, `hocs` will be
 * an empty array, and it's ok! 
 * See https://github.com/reactjs/redux/blob/master/src/compose.js#L13-L15
 */
 export function replaceComponent(name, newComponent, ...newHocs) {

  // support single argument syntax
  if (typeof arguments[0] === 'object') {
    // eslint-disable-next-line no-redeclare
    var { name, component, hocs = [] } = arguments[0];
    newComponent = component;
    newHocs = hocs;
  }

  const previousComponent = ComponentsTable[name];
  const previousHocs = previousComponent && previousComponent.hocs || [];

  if (!previousComponent) {
    // eslint-disable-next-line no-console
    console.warn(
      `Trying to replace non-registered component ${name}. The component is ` +
      'being registered. If you were trying to replace a component defined by ' +
      'another package, make sure that you haven\'t misspelled the name. Check ' +
      'also if the original component is still being registered or that it ' +
      'hasn\'t been renamed.',
    );
  }

  return registerComponent(name, newComponent, ...newHocs, ...previousHocs);  
}

export const copyHoCs = (sourceComponent, targetComponent) => {
  return compose(...sourceComponent.hocs)(targetComponent);
}

/**
 * Returns an instance of the given component name of function
 * @param {string|function} component  A component or registered component name
 * @param {Object} [props]  Optional properties to pass to the component
 */
//eslint-disable-next-line react/display-name
export const instantiateComponent = (component, props) => {
  if (!component) {
    return null;
  } else if (typeof component === 'string') {
    const Component = getComponent(component);
    return <Component {...props}/>
  } else if (typeof component === 'function' && component.prototype && component.prototype.isReactComponent) {
    const Component = component;
    return <Component {...props}/>
  } else if (typeof component === 'function') {
    return component(props);
  } else {
    return component;
  }
};

/**
 * Creates a component that will render the registered component with the given name.
 *
 * This function  may be useful when in need for some registered component, but in contexts
 * where they have not yet been initialized, for example at compile time execution. In other
 * words, when using `Components.ComponentName` is not allowed (because it has not yet been
 * populated, hence would be `undefined`), then `delayedComponent('ComponentName')` can be
 * used instead.
 *
 * @example Create a container for a registered component
 *  // SomeContainer.js
 *  import compose from 'recompose/compose';
 *  import { delayedComponent } from 'meteor/vulcan:core';
 *
 *  export default compose(
 *    // ...some hocs with container logic
 *  )(delayedComponent('ComponentName')); // cannot use Components.ComponentName in this context!
 *
 * @example {@link dynamicLoader}
 * @param {String} name Component name
 * @return {Function}
 *  Functional component that will render the given registered component
 */
export const delayedComponent = name => {
  return props => {
    const Component = Components[name] || null;
    return Component && <Component {...props} />;
  };
};
