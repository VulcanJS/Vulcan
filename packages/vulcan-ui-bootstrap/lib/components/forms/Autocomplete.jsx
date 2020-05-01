import { AsyncTypeahead } from 'react-bootstrap-typeahead'; // ES2015
import React, { useState } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const Autocomplete = props => {
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
  const [queryString = 'xohaskjdhaskdjalh', setQueryString] = useState();

  // get component's autocomplete query and use it to load autocomplete suggestions
  // note: we use useLazyQuery because 
  // we don't want to trigger the query until the user has actually typed in something
  const [loadAutocompleteOptions, { loading, error, data }] = useLazyQuery(gql(autocompleteQuery()), {
    variables: { queryString },
  });

  if (error) {
    throw new Error(error);
  }
  // apply options function to data to get suggestions in { value, label } pairs
  const autocompleteOptions = data && optionsFunction({ data });

  // apply same function to loaded data; filter by current value to avoid displaying any
  // extra unwanted items if field-level data loading loaded too many items
  // note: should be an array even if there is only one item in it
  const selectedItem = queryData ? optionsFunction({ data: queryData }).filter(d => value === d.value) : [];

  return (
    <Components.FormItem path={path} label={label} {...itemProperties}>
      <AsyncTypeahead
        {...inputProperties}
        multiple={false}
        onChange={selected => {
          if (selected.length === 0) {
            updateCurrentValues({ [path]: null });
          } else {
            const selectedId = selected[0].value;
            updateCurrentValues({ [path]: selectedId });
          }
        }}
        options={autocompleteOptions}
        id={path}
        ref={refFunction}
        onSearch={queryString => {
          setQueryString(queryString);
          loadAutocompleteOptions();
        }}
        isLoading={loading}
        selected={selectedItem}
      />
    </Components.FormItem>
  );
};

registerComponent('FormComponentAutocomplete', Autocomplete);
