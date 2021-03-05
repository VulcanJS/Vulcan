// import and re-export
import './callbacks';
export * from 'meteor/vulcan:lib';

export * from './containers';
export * from './components.js';

export { default as App } from './components/App.jsx';
export { default as AccessControl } from './components/AccessControl.jsx';
export { default as Card } from './components/Card';
export { default as Datatable } from './components/Datatable';
export { default as Dummy } from './components/Dummy.jsx';
export { default as DynamicLoading } from './components/DynamicLoading.jsx';
export { default as Error404 } from './components/Error404.jsx';
export { default as Flash } from './components/Flash.jsx';
export { default as FlashMessages } from './components/FlashMessages.jsx';
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
export { default as VerticalMenuLayout } from './components/VerticalMenuLayout/VerticalMenuLayout.jsx';
export * from './components/PaginatedList/index';

export { default as withAccess } from './containers/withAccess.js';
export { withMessages, useMessages } from './containers/withMessages.js';
export { withMultiOld, useMultiOld } from './containers/multi_old';
export { withMulti, useMulti } from './containers/multi';
export { withSingleOld, useSingleOld } from './containers/single_old';
export { withSingle, useSingle } from './containers/single';
export { withCreateOld, useCreateOld } from './containers/create_old';
export { withCreate, useCreate } from './containers/create';
export { withUpdateOld, useUpdateOld } from './containers/update_old';
export { withUpdate, useUpdate } from './containers/update';
export { withUpsertOld, useUpsertOld } from './containers/upsert_old';
export { withUpsert, useUpsert } from './containers/upsert';
export { withDeleteOld, useDeleteOld } from './containers/delete_old';
export { withDelete, useDelete } from './containers/delete';
export { withCurrentUser, useCurrentUser } from './containers/currentUser.js';
export { withMutation, useRegisteredMutation } from './containers/registeredMutation.js';
export { withSiteData, useSiteData } from './containers/siteData.js';

export * from './decorators';

export { default as withComponents } from './containers/withComponents.js';

// OpenCRUD backwards compatibility
export { default as withNew } from './containers/create.js';
export { default as withEdit } from './containers/update.js';
export { default as withRemove } from './containers/delete.js';
export { default as withList } from './containers/multi.js';
export { default as withDocument } from './containers/single.js';

export * from './menu.js';
