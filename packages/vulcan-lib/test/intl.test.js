import expect from 'expect';
import { addStrings, Utils } from 'meteor/vulcan:core';
import { formatLabel } from '../lib/modules/intl';

// constants for formatLabel
const fieldName = 'testFieldName';
const fieldNameForSchema = 'fieldNameForSchema';
const fieldNameForGlobal = 'testFieldNameGlobal';
const fieldNameForCollection = 'testFieldNameCollection';
const unknownFieldName = 'unknownFieldName';
const collectionName = 'Tests';
const labelFromCollection = 'label from collection';
const labelFromGlobal = 'label from global';
const labelFromSchema = 'label from schema';
const labelFromFieldName = 'label from fieldName';

// add the schema entries for all fields to test respect of the order too
const schema = {
  [fieldName]: {
    label: labelFromSchema,
  },
  [fieldNameForSchema]: {
    label: labelFromSchema,
  },
  [fieldNameForGlobal]: {
    label: labelFromSchema,
  },
  [fieldNameForCollection]: {
    label: labelFromSchema,
  },
};

// add the strings for formatLabel
addStrings('en', {
  // fieldName only
  [fieldName]: labelFromFieldName,
  // fieldName + global - we expect labelFromGlobal
  [fieldNameForGlobal]: labelFromFieldName,
  [`global.${fieldNameForGlobal}`]: labelFromGlobal,
  // fieldName + global + collectionName - we expect labelFromCollection
  [fieldNameForCollection]: labelFromFieldName,
  [`global.${fieldNameForCollection}`]: labelFromGlobal,
  [`${collectionName.toLowerCase()}.${fieldNameForCollection}`]: labelFromCollection,
});

describe('vulcan:lib/intl', function() {
  
  describe('formatLabel', function() {

    it('return the fieldName when there is no matching string or label', function() {
      const ENString = formatLabel({ fieldName: unknownFieldName, schema, collectionName });
      expect(ENString).toEqual(Utils.camelToSpaces(unknownFieldName));
    });
    
    it('return the matching schema label when there is no matching string', function() {
      const ENString = formatLabel({ fieldName: fieldNameForSchema, schema, collectionName });
      expect(ENString).toEqual(schema[fieldName].label);
    });
    
    it('return the label from a matched `fieldName`', function() {
      const ENString = formatLabel({ fieldName, schema, collectionName });
      expect(ENString).toEqual(labelFromFieldName);
    });
    
    it('return the label from a matched `global.fieldName`', function() {
      const ENString = formatLabel({ fieldName: fieldNameForGlobal, schema, collectionName });
      expect(ENString).toEqual(labelFromGlobal);
    });
    
    it('return the label from a matched `collectionName.fieldName`', function() {
      const ENString = formatLabel({ fieldName: fieldNameForCollection, schema, collectionName });
      expect(ENString).toEqual(labelFromCollection);
    });
    
  });
  
});
