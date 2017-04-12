import React from 'react';
import createBlockAlignmentButton from '../../utils/createBlockAlignmentButton';

export default createBlockAlignmentButton({
  alignment: 'default',
  children: (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M3,7 L3,17 L17,17 L17,7 L3,7 Z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  ),
});
