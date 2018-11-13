import './callbacks.js';

// import and re-export
export * from 'meteor/vulcan:lib';

export * from './default_mutations.js';
export * from './default_resolvers.js';

export { default as Layout } from './components/Layout.jsx';
export { default as App } from './components/App.jsx';
export { default as Icon } from './components/Icon.jsx';
export { default as Loading } from './components/Loading.jsx';
export { default as ShowIf } from './components/ShowIf.jsx';
export { default as NewButton } from './components/NewButton.jsx';
export { default as EditButton } from './components/EditButton.jsx';
export { default as MutationButton } from './components/MutationButton.jsx';
export { default as Error404 } from './components/Error404.jsx';
export { default as DynamicLoading } from './components/DynamicLoading.jsx';
export { default as HeadTags } from './components/HeadTags.jsx';
export { default as Avatar } from './components/Avatar.jsx';
export { default as Card } from './components/Card.jsx';
export { default as Datatable } from './components/Datatable.jsx';
export { default as Flash } from './components/Flash.jsx';
export { default as HelloWorld } from './components/HelloWorld.jsx';
export { default as Welcome } from './components/Welcome.jsx';
export { default as RouterHook } from './components/RouterHook.jsx';

export { default as withAccess } from './containers/withAccess.js';
export { default as withMessages } from './containers/withMessages.js';
export { default as withMulti } from './containers/withMulti.js';
export { default as withSingle } from './containers/withSingle.js';
export { default as withCreate } from './containers/withCreate.js';
export { default as withUpdate } from './containers/withUpdate.js';
export { default as withDelete } from './containers/withDelete.js';
export { default as withCurrentUser } from './containers/withCurrentUser.js';
export { default as withMutation } from './containers/withMutation.js';
export { default as withUpsert } from './containers/withUpsert.js';


// OpenCRUD backwards compatibility
export { default as withNew } from './containers/withCreate.js';
export { default as withEdit } from './containers/withUpdate.js';
export { default as withRemove } from './containers/withDelete.js';
export { default as withList } from './containers/withMulti.js';
export { default as withDocument } from './containers/withSingle.js';
