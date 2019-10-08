import './settings';
import './startup';
import './components';

export { default as withDocumentId } from '../hocs/withDocumentId';
export { default as createCollectionComponents } from './createCollectionComponents';
export * from './setupCollectionMenuItems';

export { default as setupCollectionRoutes } from './setupCollectionRoutes';

export { default, default as setupBackoffice } from './setupBackoffice';
