import loadable from 'react-loadable';
import { Components } from './components.js';
// import path from 'path';

// const adminPath = path.resolve(__dirname, './AdminHomeLoaded.jsx').replace(':', '_');


export const dynamicLoader = promise => loadable({
  loader: () => promise.then(ex => ex.default),
  LoadingComponent: Components.DynamicLoading,
  // serverSideRequirePath: adminPath
});