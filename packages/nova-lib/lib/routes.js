export let Routes = [];

export const addRoute = routeOrRouteArray => {
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];
  Routes = Routes.concat(addedRoutes);
  return Routes;
}