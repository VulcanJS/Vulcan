import React from 'react';
import SvgIcon from '@mui/icons/SvgIcon';
import { registerComponent } from 'meteor/vulcan:core';

export function capitalize(string) {
  return string
    .replace(/\-/, ' ')
    .split(' ')
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function wrapInParent(component, doWrap) {
  return doWrap ? (
    <span style={{ backgroundColor: '#DDDDDD', padding: 48, display: 'inline-block' }}>
      <span style={{ backgroundColor: '#FFFFFF', display: 'inline-block' }}>{component}</span>
    </span>
  ) : (
    component
  );
}

export const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export const MaterialIcon1 = props => {
  return (
    <SvgIcon {...props}>
      <path d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
    </SvgIcon>
  );
};

registerComponent('MaterialIcon1', MaterialIcon1);
