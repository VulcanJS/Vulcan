// import and re-export
import './callbacks';
export * from 'meteor/vulcan:lib';

export * from './default_mutations.js';
export * from './default_resolvers.js';

export * from './components.js';

export { default as App } from './components/App.jsx';
export { default as Card } from './components/Card';
export { default as Datatable } from './components/Datatable';
export { default as Dummy } from './components/Dummy.jsx';
export { default as DynamicLoading } from './components/DynamicLoading.jsx';
export { default as Error404 } from './components/Error404.jsx';
export { default as Flash } from './components/Flash.jsx';
export { default as HeadTags } from './components/HeadTags.jsx';
export { default as HelloWorld } from './components/HelloWorld.jsx';
export { default as Icon } from './components/Icon.jsx';
export { default as Layout } from './components/Layout.jsx';
export { default as Loading } from './components/Loading';
export { default as MutationButton } from './components/MutationButton.jsx';
export { default as RouterHook } from './components/RouterHook.jsx';
export { default as ScrollToTop } from './components/ScrollToTop.jsx';
export { default as ShowIf } from './components/ShowIf.jsx';
export { default as Welcome } from './components/Welcome.jsx';

export { default as withAccess } from './containers/withAccess.js';
export { default as withMessages } from './containers/withMessages.js';
export { withMulti, useMulti } from './containers/multi.js';
export { withSingle, useSingle } from './containers/single.js';
export { withCreate, useCreate } from './containers/create.js';
export { withUpdate, useUpdate } from './containers/update.js';
export { withUpsert, useUpsert } from './containers/upsert.js';
export { withDelete, useDelete } from './containers/delete.js';
export { withCurrentUser, useCurrentUser } from './containers/currentUser.js';
export { withMutation, useRegisteredMutation } from './containers/registeredMutation.js';
export { withSiteData, useSiteData } from './containers/siteData.js';

export { default as withComponents } from './containers/withComponents';

export { default as MessageContext } from './messages.js';

// OpenCRUD backwards compatibility
export { default as withNew } from './containers/create.js';
export { default as withEdit } from './containers/update.js';
export { default as withRemove } from './containers/delete.js';
export { default as withList } from './containers/multi.js';
export { default as withDocument } from './containers/single.js';
