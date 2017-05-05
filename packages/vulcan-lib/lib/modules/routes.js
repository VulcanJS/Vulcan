import {Components, getComponent} from './components';

export const Routes = {}; // will be populated on startup (see vulcan:routing)
export const RoutesTable = {}; // storage for infos about routes themselves

/*
 A route is defined in the list like:
 RoutesTable.foobar = {
 name: 'foobar',
 path: '/xyz',
 component: getComponent('FooBar')
 componentName: 'FooBar' // optional
 }

 if there there is value for parentRouteName it will look for the route and add the new route as a child of it
 */
export const addRoute = (routeOrRouteArray, parentRouteName) => {

  // be sure to have an array of routes to manipulate
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];

  // if there is a value for parentRouteName you are adding this route as new child
  if (parentRouteName) {

    addAsChildRoute(parentRouteName, addedRoutes);

  } else {

    // modify the routes table with the new routes
    addedRoutes.map(({name, path, ...properties}) => {

      // check if there is already a route registered to this path
      // note: destructure in order to get the first item of the array, as _.filter returns an array
      const [routeWithSamePath] = _.filter(RoutesTable, route => route.path === path);

      if (routeWithSamePath) {
        // delete the route registered with same path
        delete RoutesTable[routeWithSamePath.name];
      }

      // register the new route
      RoutesTable[name] = {
        name,
        path,
        ...properties
      };

    });
  }
};


/**
 A route is defined in the list like: (same as above)
 RoutesTable.foobar = {
 name: 'foobar',
 path: '/xyz',
 component: getComponent('FooBar')
 componentName: 'FooBar' // optional
 }

 NOTE: This is implemented on single level deep ONLY for now
 **/


export const addAsChildRoute = (parentRouteName, addedRoutes) => {

  // if the parentRouteName does not exist, error
  if (!RoutesTable[parentRouteName]) {
    throw new Error(`Route ${parentRouteName} doesn't exist`)
  }

  // modify the routes table with the new routes
  addedRoutes.map(({name, path, ...properties}) => {

    // get the current child routes for this Route
    const childRoutes = RoutesTable[parentRouteName]['childRoutes'] || [];

    // check if there is already a route registered to this path
    const [routeWithSamePath] = _.filter(childRoutes, route => route.path === path);

    if (routeWithSamePath) {
      // delete the route registered with same path
      delete childRoutes[routeWithSamePath.name];
    }

    // append to the child routes the new route
    childRoutes.push({
      name,
      path,
      ...properties
    });

    // register the new child route (overwriting the current which is fine)
    RoutesTable[parentRouteName]['childRoutes'] = childRoutes;

  });
};


export const getRoute = name => {
  const routeDef = RoutesTable[name];

  // components should be loaded by now (populateComponentsApp function), we can grab the component in the lookup table and assign it to the route
  if (!routeDef.component && routeDef.componentName) {
    routeDef.component = getComponent(routeDef.componentName);
  }

  return routeDef;
}

/**
 * Populate the lookup table for routes to be callable
 * ℹ️ Called once on app startup
 **/
export const populateRoutesApp = () => {
  // loop over each component in the list
  Object.keys(RoutesTable).map(name => {

    // populate an entry in the lookup table
    Routes[name] = getRoute(name);

    // uncomment for debug
    // console.log('init route:', name);
  });
}

