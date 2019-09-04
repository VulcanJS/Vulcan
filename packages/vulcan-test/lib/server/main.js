export * from '../modules';
export { default as isoCreateCollection } from './isoCreateCollection';
export { default as initServerTest } from './initServerTest';
export { default as initComponentTest } from './initComponentTest';

// init test in any case
import { default as initServerTest } from './initServerTest';
initServerTest();