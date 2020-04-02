import React from 'react';
import PropTypes from 'prop-types';
import { Utils, Components, registerComponent, mergeWithComponents } from 'meteor/vulcan:core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const FormComponentLoader = props => {
  const { name, query, children, options, value } = props;
  // use field's `query` property to load field-specific data
  // pass current field value as variable to the query just in case
  // for legacy reasons, also handle case where only query fragment is specified
  const hasQueryKeyword = q => q.trim().substr(0, 5) === 'query';
  const formComponentQueryText = hasQueryKeyword(query) ? query : `query FormComponent${Utils.capitalize(name)}Query {${query}}`;
  const formComponentQuery = gql(formComponentQueryText);
  const { loading, error, data } = useQuery(formComponentQuery, { variables: { value } });
  if (error) {
    throw new Error(error);
  }

  // pass newly loaded data (and options if needed) to child component
  const extraProps = { data, queryData: data, queryError: error, queryLoading: loading };
  if (typeof options === 'function') {
    extraProps.options = options.call({}, { ...props, data });
  }

  const fci = React.cloneElement(children, extraProps);

  return <div className="form-component-loader">{loading ? <Components.Loading /> : fci}</div>;
};

FormComponentLoader.propTypes = {};
registerComponent({
  name: 'FormComponentLoader',
  component: FormComponentLoader,
});
