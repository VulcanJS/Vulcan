import { Components, getComponent } from './components';

export const Routes = {
  list: {},
  // + ...lookup table
};

/*
A route is defined in the list like:
Routes.list.foobar = {
 name: 'foobar',
 call: () => ({name: 'foobar', path: '/xyz', componentName: Components.Foo}),
}
*/
export const addRoute = routeOrRouteArray => {
  
  // be sure to have an array of routes to manipulate
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];
  
  // modify the routes list witht the new routes
  addedRoutes.map(({name, ...properties}) => {
    Routes.list[name] = {
      name,
      ...properties
    };
  });
  
}

export const getRoute = name => {
  const routeDef = Routes.list[name];
  
  // components should be loaded by now (createComponentsLookupTable function), we can grab the component in the lookup table and assign it to the route
  return {
    ...routeDef,
    component: getComponent(routeDef.componentName),
  };
}

export const createRoutesLookupTable = () => {
  // loop over each component in the list
  Object.keys(Routes.list).map(name => {
    
    // populate an entry in the lookup table
    Routes[name] = getRoute(name);
    
    // uncomment for debug
    // console.log('init route:', name);
  });
}
 
