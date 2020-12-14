import React, { useEffect } from 'react';
import { Components, registerComponent, expandQueryFragments } from 'meteor/vulcan:core';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import isEmpty from 'lodash/isEmpty';

const FormComponentLoader = props => {
  const { query, children, options, value, queryWaitsForValue } = props;

  // if query is a function, execute it
  const queryText = typeof query === 'function' ? query({ value }) : query;

  const [loadFieldQuery, { loading, error, data }] = useLazyQuery(gql(expandQueryFragments(queryText)));

  const valueIsEmpty = isEmpty(value) || (Array.isArray(value) && value.length) === 0;

  useEffect(() => {
    if (queryWaitsForValue && valueIsEmpty) {
      // we don't want to run this query until we have a value to pass to it
      // so do nothing
    } else {
      loadFieldQuery({
        variables: { value },
      });
    }
  }, [valueIsEmpty, value, queryWaitsForValue]);

  if (error) {
    throw new Error(error);
  }

  if (loading){
    return (
      <div className="form-component-loader">
        <Components.Loading />
      </div>
    );
  }

  // pass newly loaded data (and options if needed) to child component
  const extraProps = { data, queryData: data, queryError: error, loading };
  if (typeof options === 'function') {
    extraProps.optionsFunction = options;
    extraProps.options = options.call({}, { ...props, data });
  }

  const fci = React.cloneElement(children, extraProps);

  return <div className="form-component-loader">{fci}</div>;
};

FormComponentLoader.propTypes = {};
registerComponent({
  name: 'FormComponentLoader',
  component: FormComponentLoader,
});
