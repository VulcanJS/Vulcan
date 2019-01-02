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
let splitComponentImportFns = {};

// Dictionary from component name => actual component. On the server, this is
// fully populated on startup; on the client, this is populated as-needed. This
// is a global (rather than part of the REACT tree) because it persists across
// navigation events.
let splitComponentClasses = {};

export class SplitComponentCollector {
  constructor() {
    this.componentsUsed = {};
  }
  
  getComponentsUsedArray() {
    let ret = [];
    for(let key in this.componentsUsed)
      ret.push(key);
    return ret;
  }
  
  // Either returns the named component, or returns NULL immediately and calls
  // onReady() later at a time when the component is ready, at which point
  // calling getComponent again will return the component.
  getComponent(name, onReady) {
    if (!this.componentsUsed[name]) {
      this.componentsUsed[name] = true
    }
    
    if (splitComponentClasses[name]) {
      return splitComponentClasses[name];
    } else {
      loadSplitComponents([name], onReady);
    }
  }
}

export class SplitComponentWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      componentsLoaded: 0,
    }
  }
  
  render() {
    const { collector, children } = this.props;
    
    return (
      <SplitComponentContext.Provider value={{
        getComponent: (componentName, onReady) => {
          return collector.getComponent(componentName, onReady);
        }
      }}>
        {children}
      </SplitComponentContext.Provider>
    );
  }
}

export class SplitComponent extends PureComponent {
  componentFinishedLoading = () => {
    this.forceUpdate();
  }
  
  render() {
    const { name, ...otherProps } = this.props;
    
    if (!splitComponentImportFns[name])
      throw new Error(`${name} is not registered as a split component`);
    
    return (
      <SplitComponentContext.Consumer>
        {(context) => {
          const Component = context.getComponent(name, this.componentFinishedLoading);
          if (Component) {
            return <Component {...otherProps}/>
          } else {
            return <Components.Loading/>
          }
        }}
      </SplitComponentContext.Consumer>
    );
  }
}

export function registerSplitComponent(name, importFn)
{
  if (splitComponentImportFns[name]) {
    throw new Error(`${name} is already registered as a split component`);
  }
  
  splitComponentImportFns[name] = importFn;
  
  if (Meteor.isServer) {
    importFn().then(componentExports => splitComponentClasses[name] = componentExports.default);
  }
}

export function loadSplitComponents(componentsList, onFinish)
{
  if (!componentsList || componentsList.length==0) {
    Meteor.defer(onFinish);
    return;
  }
  
  Promise.all(
    componentsList.map(async (componentName) => {
      if (!splitComponentImportFns[componentName])
        throw new Error(`Requested load of split-component "${componentName}" which is not registered`);
      const componentExports = await splitComponentImportFns[componentName]();
      splitComponentClasses[componentName] = componentExports.default;
    }),
    onFinish
  );
}
