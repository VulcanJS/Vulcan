import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import React, { useState } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const AutocompleteMultiple = props => {
  const {
    queryData,
    updateCurrentValues,
    refFunction,
    path,
    inputProperties = {},
    itemProperties = {},
    autocompleteQuery,
    optionsFunction,
  } = props;

  const { value, label } = inputProperties;

  // store current autocomplete query string in local component state
  const [queryString, setQueryString] = useState();

  // get component's autocomplete query and use it to load autocomplete suggestions
  const autoCompleteQuery = gql(autocompleteQuery);
  const { loading, error, data } = useQuery(autoCompleteQuery, { variables: { queryString } });
  if (error) {
    throw new Error(error);
  }
  // apply options function to data to get suggestions in { value, label } pairs
  const autocompleteOptions = data && optionsFunction({ data });

  // apply same function to loaded data; filter by current value to avoid displaying any
  // extra unwanted items if field-level data loading loaded too many items
  const selectedItems = queryData && optionsFunction({ data: queryData }).filter(d => value.includes(d.value));

  return (
    <Components.FormItem path={path} label={label} {...itemProperties}>
      <AsyncTypeahead
        {...inputProperties}
        multiple
        onChange={selected => {
          const selectedIds = selected.map(({ value }) => value);
          updateCurrentValues({ [path]: selectedIds });
        }}
        options={autocompleteOptions}
        id={path}
        ref={refFunction}
        onSearch={queryString => {
          setQueryString(queryString);
        }}
        isLoading={loading}
        selected={selectedItems}
      />
    </Components.FormItem>
  );
};

registerComponent('FormComponentAutocompleteMultiple', AutocompleteMultiple);
