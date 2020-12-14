import { Components, getComponent } from './components';

export type Route = {
  name: string;
  path: string;
  componentName?: string,
  layoutName?: string,
}

export const Routes = new Map(); // will be populated on startup 
export const RoutesTable = new Map(); // storage for infos about routes themselves

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
export const addRoute = (routeOrRouteArray: Route|Array<Route>, parentRouteName?: string) => {

  // be sure to have an array of routes to manipulate
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];

  // if there is a value for parentRouteName you are adding this route as new child
  if (parentRouteName) {

    addAsChildRoute(parentRouteName, addedRoutes);

  } else {

    // modify the routes table with the new routes
    addedRoutes.forEach(({ name, path, ...properties }) => {

      // check if there is already a route registered to this path
      const routeWithSamePath = Object.values(RoutesTable).find(route => route.path === path);

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

export const extendRoute = (routeName, routeProps) => {

  const route = Object.values(RoutesTable).find(route => route.name === routeName);

  if (route) {
    RoutesTable[route.name] = {
      ...route,
      ...routeProps
    };
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
    throw new Error(`Route ${parentRouteName} doesn't exist`);
  }

  // modify the routes table with the new routes
  addedRoutes.map(({ name, path, ...properties }) => {

    // get the current child routes for this Route
    const childRoutes = RoutesTable[parentRouteName]['childRoutes'] || [];

    // check if there is already a route registered to this path
    const routeWithSamePath = childRoutes.find(route => route.path === path);

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
};

export const getChildRoute = (name, index) => {
  const routeDef = RoutesTable[name]['childRoutes'][index];

  // components should be loaded by now (populateComponentsApp function), we can grab the component in the lookup table and assign it to the route
  if (!routeDef.component && routeDef.componentName) {
    routeDef.component = getComponent(routeDef.componentName);
  }

  return routeDef;
};

/**
 * Populate the lookup table for routes to be callable
 * ℹ️ Called once on app startup
 **/
export const populateRoutesApp = () => {
  // loop over each component in the list
  Object.keys(RoutesTable).map(name => {
    // loop over child routes if available
    if (typeof RoutesTable[name]['childRoutes'] !== typeof undefined) {
      RoutesTable[name]['childRoutes'].map((item, index) => {
        RoutesTable[name]['childRoutes'][index] = getChildRoute(name, index);
      });
    }

    // populate an entry in the lookup table
    Routes[name] = getRoute(name);

    // uncomment for debug
    // console.log('init route:', name);
  });
};

// Should be used only in tests
export const emptyRoutes = () => {
  Object.keys(Routes).map((key) => {
    delete Routes[key];
  });
};
