import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import React, { useState } from 'react';
import { mergeWithComponents, registerComponent, expandQueryFragments } from 'meteor/vulcan:core';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';

const MultiAutocomplete = props => {
  const {
    queryData,
    updateCurrentValues,
    refFunction,
    path,
    inputProperties = {},
    itemProperties = {},
    autocompleteQuery,
    optionsFunction,
    formComponents,
  } = props;

  const Components = mergeWithComponents(formComponents);

  const { value, label } = inputProperties;

  // store current autocomplete query string in local component state
  const [queryString, setQueryString] = useState();

  // get component's autocomplete query and use it to load autocomplete suggestions
  // note: we use useLazyQuery because 
  // we don't want to trigger the query until the user has actually typed in something
  const [loadAutocompleteOptions, { loading, error, data }] = useLazyQuery(gql(expandQueryFragments(autocompleteQuery())), {
    variables: { queryString },
  });

  if (error) {
    throw new Error(error);
  }
  // apply options function to data to get suggestions in { value, label } pairs
  const autocompleteOptions = data && optionsFunction({ data });

  // apply same function to loaded data; filter by current value to avoid displaying any
  // extra unwanted items if field-level data loading loaded too many items
  const selectedItems = queryData && optionsFunction({ data: queryData }).filter(d => value.includes(d.value));

  // console.log(queryData)
  // console.log(queryData && optionsFunction({ data: queryData }));
  // console.log(value)
  // console.log(selectedItems)
  
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
          loadAutocompleteOptions();
        }}
        isLoading={loading}
        selected={selectedItems}
      />
    </Components.FormItem>
  );
};

registerComponent('FormComponentMultiAutocomplete', MultiAutocomplete);
