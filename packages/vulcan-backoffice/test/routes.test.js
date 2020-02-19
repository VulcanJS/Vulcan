import expect from 'expect';
import { generateRoutes } from '../lib/modules/setupCollectionRoutes';

const DummyCollection = {
  options: {
    collectionName: 'Dummies',
  },
};
describe('vulcan:backoffice/setupCollectionRoutes', function () {
  it('generate routes', function () {
    const options = {}
    const { listRoute, itemRoute } = generateRoutes(DummyCollection, options);
    //expect(baseRoute.path).toEqual('/dummies');
    expect(listRoute.path).toEqual('/dummies');
    expect(itemRoute.path).toEqual('/dummies/:documentId');
  });
});
