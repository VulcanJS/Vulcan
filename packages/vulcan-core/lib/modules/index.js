import './callbacks.js';

// import and re-export
export {
  // apollo
  createApolloClient,
  // callbacks
  Callbacks, addCallback, removeCallback, runCallbacks, runCallbacksAsync,
  // components
  Components, registerComponent, replaceComponent, getRawComponent, getComponent, copyHoCs, populateComponentsApp,
  // collections
  Collections, createCollection,
  // fragments
  Fragments, registerFragment, getFragment, getFragmentName, extendFragment, removeFromFragment,
  // graphql
  GraphQLSchema, addGraphQLSchema, addGraphQLQuery, addGraphQLMutation, addGraphQLResolvers, removeGraphQLResolver, addToGraphQLContext, 
  // headtags
  Headtags,
  // inject data
  InjectData,
  // redux
  configureStore, addAction, getActions, addReducer, getReducers, addMiddleware, getMiddlewares,
  // render context
  renderContext, getRenderContext, withRenderContext,
  // routes
  Routes, addRoute, addAsChildRoute, getRoute, populateRoutesApp,
  // settings
  getSetting,
  // strings
  Strings, addStrings,
  // utils
  Utils,
  // mutations (for server only)
  newMutation, editMutation, removeMutation,
  // render context (for server only)
  withRenderContextEnvironment,
  // meteor patch (for server only)
  webAppConnectHandlersUse
} from 'meteor/vulcan:lib';

export { default as Layout } from "./components/Layout.jsx";
export { default as App } from "./components/App.jsx";
export { default as Icon } from "./components/Icon.jsx";
export { default as Loading } from "./components/Loading.jsx";
export { default as ShowIf } from "./components/ShowIf.jsx";
export { default as ModalTrigger } from './components/ModalTrigger.jsx';
export { default as Error404 } from './components/Error404.jsx';

export { default as withMessages } from "./containers/withMessages.js";
export { default as withList } from './containers/withList.js';
export { default as withDocument } from './containers/withDocument.js';
export { default as withNew } from './containers/withNew.js';
export { default as withEdit } from './containers/withEdit.js';
export { default as withRemove } from './containers/withRemove.js';
export { default as withCurrentUser } from './containers/withCurrentUser.js';
export { default as withMutation } from './containers/withMutation.js';
