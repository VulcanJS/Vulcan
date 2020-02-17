/**
 * Pass a route param to its child
 *
 */
import React from 'react';
import PropTypes from 'prop-types';

export const withRouteParam = fieldName => Component => {
  const Wrapper = props => (
    <Component
      {...props}
      {...{
        [fieldName]: props[fieldName] || (props.params && props.params[fieldName]) || undefined,
      }}
    />
  );

  Wrapper.propTypes = {
    // @see React router 4 withRouter API
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
  };
  Wrapper.displayName = `withRouteParam(${fieldName})(${Component.displayName})`;
  return Wrapper;
};
export default withRouteParam;
