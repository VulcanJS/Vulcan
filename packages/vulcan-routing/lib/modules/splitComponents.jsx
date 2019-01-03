import React, { Component, PureComponent } from 'react';
import { Components } from 'meteor/vulcan:lib';

// Split Components.
// =================
//
// Split components are Components (in the React sense of the word) which are
// not included in the main Javascript bundle, because they aren't always on
// the page and loading/initializing them would be costly. Features that
// suggest good candidates for split components:
//  * It is not used on the front page or the most commonly loaded pages
//  * It has a large library dependency that isn't used otherwise
//  * It has a lot of Javascript
//  * It is a bottleneck in the graph of component dependencies
//
// How to use this:
// ================
//
// A split component occupies its own Javascript file, which (by convention)
// has the same name as the component. Then in a different file, during Meteor
// startup on both the client and server, call:
//
//   import { registerSplitComponent } from 'meteor/vulcan:routing';
//   registerSplitComponent(MySplitComponent, ()=>import("./path/to/MySplitComponent.jsx"))
//
// Within MySplitComponent.jsx, export the component as default. To reference
// a split component within another component, use
//
//   import { SplitComponent } from 'meteor/vulcan:routing';
//   <SplitComponent name="MySplitComponent" ...otherProps/>
//
// Architectural details:
// ======================
//
// Both the client and server React DOM trees are wrapped in
// SplitComponentWrapper. On the server, this collects a list of all
// components used by the server-side render; this is then sent to the client,
// which loads those components before it rehydrates.
//
// On navigation, there is no rehydrating step. When a SplitComponent tries to
// render and the component it wants is not yet loaded, it shows a
// Components.Loading, kicks off an import asynchronously (this might or might
// not involve a round trip to the server), and sets up a callback which will
// notify it when the component is ready to use.

const SplitComponentContext = React.createContext("splitComponents");

// Dictionary from component name => import(that component). Populated by
// calling registerSplitComponent from application code. On both the client
// and server, this is fully populated on startup.


// Dictionary from component name => actual component. On the server, this is
// fully populated on startup; on the client, this is populated as-needed. This
// is a global (rather than part of the REACT tree) because it persists across
// navigation events.

// Global Registry of split Components. Used accross navigation events (and clients
// on the server)
export let splitComponentRegistry = {
  // Functions that when called asynchronously load a new Component (usually of the form `() => import(<path>)`)
  // This should be fully populated on startup
  // This field should be considered private
  _importFunctions: {}, 

  // Fully loaded components that can be rendered on the client or server
  // On the server, this is fully populated, on the client, it is populated as-needed
  // This field should be considered private
  _components: {},

  // Adds a component to the registry. Allows it to be loaded later on, but does not run it's import function
  async registerComponent(name, importFn) {
    if (this._importFunctions[name]) {
      throw new Error(`${name} is already registered as a split component`);
    }
    this._importFunctions[name] = importFn
    // On the server, load all components immediately
    if (Meteor.isServer) {
      const componentExports = await importFn()
      this._components[name] = componentExports.default
    }
  },

  // Loads a component, which means actually running its async import function and caching the result
  async loadComponent (name) {
    if (!this._importFunctions[name]) {
      throw new Error(`Requested load of split-component "${name}" which is not registered`);
    }
    if (!this._components[name]) {
      const componentExports = await this._importFunctions[name]();
      this._components[name] = componentExports.default;
    }
    return this._components[name]
  },

  // Loads multiple components at the same time
  async loadComponents(nameArray) {
    return await Promise.all(nameArray.map(name => this.loadComponent(name)))
  },

  // Gets a split component by name, if fully loaded. Otherwise returns undefined
  getComponent(name) {
    return this._components[name]
  },

  // Returns Boolean on whether component with given name is registered 
  isComponentRegistered(name) {
    return !!this._importFunctions[name]
  }
}

export function registerSplitComponent(name, importFn) {
  splitComponentRegistry.registerComponent(name, importFn)
}

export class SplitComponentCollector {
  usedComponents = {}
  
  getUsedComponents = () => {
    return Object.keys(this.usedComponents)
  }
  
  // Either returns the named component, or returns NULL immediately and calls
  // `callback` later at a time when the component is ready, after which
  // calling getComponent again will return the component.
  getComponent = (name, callback) => {
    this.usedComponents[name] = true
    const component = splitComponentRegistry.getComponent(name)
    if (component) {
      return component
    } else {
      splitComponentRegistry.loadComponent(name).then(callback)
      return null
    }
  }
}


// Wraps the DOM on the server, and provides context for managing split
// components.
export const SplitComponentWrapper = ({collector, children}) => {
  return (
    <SplitComponentContext.Provider value={{
      getComponent: collector.getComponent
    }}>
      {children}
    </SplitComponentContext.Provider>
  );
}


class SplitComponentRenderer extends PureComponent {
  state = {
    Component: this.props.getComponent(this.props.name) || Components.Loading
  }
  componentDidMount = () => {
    const { name, getComponent } = this.props
    if (!splitComponentRegistry.isComponentRegistered(name)) {
      throw new Error(`${name} is not registered as a split component`);
    }
    getComponent(name, (Component) => {this.setState({Component})})
  }
  render() {
    const { name, ...rest } = this.props
    const { Component } = this.state
    return <Component {...rest} />
  }
}

export function SplitComponent(props) {
  return (
    <SplitComponentContext.Consumer>
      {(context) => {
        return <SplitComponentRenderer getComponent={context.getComponent} {...props} />
      }}
    </SplitComponentContext.Consumer>
  );
}
