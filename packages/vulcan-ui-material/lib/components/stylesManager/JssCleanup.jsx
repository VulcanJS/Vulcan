/**
 * Remove JSS style tag after rehydratation
 *
 * @see https://cssinjs.org/server-side-rendering?v=v10.7.1
 */
import React, { PureComponent } from 'react';
import { useEffect } from 'react';

export const JssCleanup = ({ children }) => {
  useEffect(() => {
    if (!document || !document.getElementById) return;
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);
  return children;
};

export default JssCleanup;
