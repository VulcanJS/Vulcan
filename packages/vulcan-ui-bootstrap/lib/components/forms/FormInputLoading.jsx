import React from 'react';
import { registerComponent, Components } from 'meteor/vulcan:core';

const FormInputLoading = ({ loading, children }) => (
  <div className={`form-input-loading form-input-loading-${loading ? 'isLoading' : 'notLoading'}`}>
    <div className="form-input-loading-inner">{children}</div>
    {loading && (
      <div className="form-input-loading-loader">
        <Components.Loading />
      </div>
    )}
  </div>
);

registerComponent('FormInputLoading', FormInputLoading);
