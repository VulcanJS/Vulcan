import React from 'react';
import createBlockAlignmentButton from '../../utils/createBlockAlignmentButton';

export default createBlockAlignmentButton({
  alignment: 'center',
  children: (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3,21 L21,21 L21,19 L3,19 L3,21 Z M3,3 L3,5 L21,5 L21,3 L3,3 Z M5,7 L5,17 L19,17 L19,7 L5,7 Z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  ),
});
