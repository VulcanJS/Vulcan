import { Components, getComponent } from './components';

export const Routes = {}; // will be populated on startup (see nova:routing)
export const RoutesTable = {}; // storage for infos about routes themselves

/*
A route is defined in the list like:
RoutesTable.foobar = {
 name: 'foobar',
 path: '/xyz', 
 component: getComponent('FooBar')
 componentName: 'FooBar' // optional
}
*/
export const addRoute = routeOrRouteArray => {
  
  // be sure to have an array of routes to manipulate
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];
  
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
 
