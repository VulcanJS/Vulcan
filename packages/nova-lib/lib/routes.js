export let Routes = [];

export const addRoute = routeOrRouteArray => {
  const addedRoutes = Array.isArray(routeOrRouteArray) ? routeOrRouteArray : [routeOrRouteArray];
  addedRoutes.forEach(route => Routes.push(route));
  return Routes;
}
