import { Utils } from '../lib/modules/utils';
import expect from 'expect';


describe('vulcan:lib/utils', function () {
  
  const collection = {
    findOne: function ({ slug }) {
      switch(slug) {
        case 'duplicate-name':
          return {
            _id: 'duplicate-name',
            name: 'Duplicate name',
            slug: 'duplicate-name',
          };
        case 'triplicate-name':
          return {
            _id: 'triplicate-name',
            name: 'Triplicate name',
            slug: 'triplicate-name',
          };
        case 'triplicate-name-1':
          return {
            _id: 'triplicate-name-1',
            name: 'Triplicate name',
            slug: 'triplicate-name-1',
          };
        case 'renamed-name':
          return {
            _id: 'renamed-name',
            name: 'RENAMED NAME',
            slug: 'renamed-name',
          };
        default:
          return null;
      }
    }
  };
  
  it('returns the same slug when there are no conflicts', function () {
    const slug = 'unique-name';
    const unusedSlug = Utils.getUnusedSlug(collection, slug);

    expect(unusedSlug).toEqual(slug);
  });
  
  it('appends integer to slug when there is a conflict', function () {
    const slug = 'duplicate-name';
    const unusedSlug = Utils.getUnusedSlug(collection, slug);

    expect(unusedSlug).toEqual(slug + '-1');
  });
  
  it('appends incremented integer to slug when there is a conflict', function () {
    const slug = 'triplicate-name';
    const unusedSlug = Utils.getUnusedSlug(collection, slug);

    expect(unusedSlug).toEqual(slug + '-2');
  });
  
  it('returns the same slug when the conflict has the same _id', function () {
    // This tests the case where a document is renamed, but its slug remains the same
    // For example 'RENAMED NAME' is changed to 'Renamed name'; the slug should not increment
    const slug = 'renamed-name';
    const documentId = 'renamed-name';
    const unusedSlug = Utils.getUnusedSlug(collection, slug, documentId);
    
    expect(unusedSlug).toEqual(slug);
  });
  
  it('appends integer to slug when the conflict has the same _id, but it’s not passed to getUnusedSlug', function () {
    // This tests the case where a document is renamed, but its slug remains the same
    // For example 'RENAMED NAME' is changed to 'Renamed name'; the slug should not increment
    const slug = 'renamed-name';
    const unusedSlug = Utils.getUnusedSlug(collection, slug);
    
    expect(unusedSlug).toEqual(slug + '-1');
  });
  
});
