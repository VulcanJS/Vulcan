import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';

const LoadingButton = ({ loading, label, onClick, children, className = '', ...rest }) => {

  const wrapperStyle = {
    position: 'relative',
  };

  const labelStyle = loading ? { opacity: 0.5 } : {};

  const loadingStyle = loading ? {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } : { display: 'none'};

  return (
    <Components.Button className={`${loading ? 'loading-button-loading' : 'loading-button-notloading'} ${className}`} onClick={onClick} {...rest}>
      <span style={wrapperStyle}>
        <span style={labelStyle}>{label || children}</span>
        <span style={loadingStyle}><Components.Loading/></span>
      </span>
    </Components.Button>
  );
};

registerComponent('LoadingButton', LoadingButton);
