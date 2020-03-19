import React from 'react';
import {
  Components,
  replaceComponent,
} from 'meteor/vulcan:core';

const checkboxOperator = '_in';
const DatatableFilterCheckboxes = ({
  options,
  filters = { [checkboxOperator]: [] },
  setFilters,
}) => (
  <Components.FormComponentCheckboxGroup
    layout= 'inputOnly'
    inputProperties={{ options, value: filters[checkboxOperator] }}
    onChange={(newValues) => {
      setFilters({ [checkboxOperator]: newValues });
    }}
  />
);

replaceComponent('DatatableFilterCheckboxes', DatatableFilterCheckboxes);