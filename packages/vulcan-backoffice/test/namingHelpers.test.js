import expect from 'expect';
import {
  getCollectionName,
  getBasePath,
  getNewPath,
  getEditPath,
  getDetailsPath,
} from '../lib/modules/namingHelpers';

const dummyCollectionName = 'Dummies';
const DummyCollection = {
  options: {
    collectionName: dummyCollectionName,
  },
};
describe('vulcan:backoffice/namingHelpers', function () {
  it('get collection name', function () {
    const collectionName = getCollectionName(DummyCollection);
    expect(collectionName).toEqual(dummyCollectionName);
  });
  it('get base path', function () {
    const basePath = getBasePath(DummyCollection);
    expect(basePath).toEqual('/dummies');
  });
  it('add a prefix to base path', function () {
    const basePath = getBasePath(DummyCollection, '/admin');
    expect(basePath).toEqual('/admin/dummies');
  });
  it('get new path', function () {
    const Path = getNewPath(DummyCollection);
    expect(Path).toEqual('/dummies/create');
  });
  it('get edit path', function () {
    const Path = getEditPath(DummyCollection);
    expect(Path).toEqual('/dummies/:documentId/edit');
  });
  it('get details path', function () {
    const Path = getDetailsPath(DummyCollection);
    expect(Path).toEqual('/dummies/:documentId');
  });
});
