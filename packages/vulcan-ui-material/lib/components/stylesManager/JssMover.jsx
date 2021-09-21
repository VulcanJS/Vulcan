import { replaceComponent, Components } from 'meteor/vulcan:lib';
import { useEffect } from 'react';

/**
 * A quickfix to move JSS styles upper in the tree
 *
 * @see packages/vulcan-core/lib/client/components/AppGenerator.jsx
 * (we don't have access to router yet, so we also add smth similar in AppGenerator)
 */
export const JssMover = ({ children }) => {
  useEffect(() => {
    console.warn('JssMover component moves data-jss styles to the top');
    console.warn('See https://github.com/mui-org/material-ui/issues/24109');
    const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');
    if (elements.length) {
      document.head.prepend(...elements);
    }
  }, []);
  // also apply every second
  useEffect(() => {
    const checkJss = setInterval(() => {
      const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');
      if (elements.length) {
        console.warn('Moving JSS styles every x seconds');
        document.head.prepend(...elements);
      }
    }, 3000);
    return () => {
      clearInterval(checkJss);
    };
  });
  return children;
};
