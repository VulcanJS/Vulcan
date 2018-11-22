import { extractCollectionInfo, extractFragmentInfo } from '../lib/modules/handleOptions';
import expect from 'expect';

describe('vulcan:lib/handleOptions', function() {
  const expectedCollectionName = 'COLLECTION_NAME';
  const expectedCollection = { options: { collectionName: expectedCollectionName } };

  it('get collectionName from collection', function() {
    const options = { collection: expectedCollection };
    const { collection, collectionName } = extractCollectionInfo(options);
    expect(collection).toEqual(expectedCollection);
    expect(collectionName).toEqual(expectedCollectionName);
  });
  it.skip('get collection from collectionName', function() {
    // TODO: mock getCollection
    const options = { collectionName: expectedCollectionName };
    const { collection, collectionName } = extractCollectionInfo(options);
    expect(collection).toEqual(expectedCollection);
    expect(collectionName).toEqual(expectedCollectionName);
  });
  const expectedFragmentName = 'FRAGMENT_NAME';
  const expectedFragment = { definitions: [{ name: { value: expectedFragmentName } }] };
  it.skip('get fragment from fragmentName', function() {
    // TODO: mock getCollection
    const options = { fragmentName: expectedFragmentName };
    const { fragment, fragmentName } = extractFragmentInfo(options);
    expect(fragment).toEqual(expectedFragment);
    expect(fragmentName).toEqual(expectedFragmentName);
  });
  it('get fragmentName from fragment', function() {
    const options = { fragment: expectedFragment };
    const { fragment, fragmentName } = extractFragmentInfo(options);
    expect(fragment).toEqual(expectedFragment);
    expect(fragmentName).toEqual(expectedFragmentName);
  });
  it.skip('get fragmentName and fragment from collectionName', function() {
    // TODO: mock getFragment
    // if options does not contain fragment, we get the collection default fragment based on its name
    const options = {};
    const { fragment, fragmentName } = extractFragmentInfo(options, expectedCollectionName);
    expect(fragment).toEqual(expectedFragment);
    expect(fragmentName).toEqual(expectedFragmentName);
  });
});
