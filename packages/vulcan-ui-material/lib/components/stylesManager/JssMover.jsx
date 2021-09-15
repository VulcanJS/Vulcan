import { useEffect } from 'react';

/**
 * A quickfix to move JSS styles upper in the tree
 */
export const JssMover = ({ children }) => {
  useEffect(() => {
    console.warn('JssMover component moves data-jss styles to the top');
    console.warn('See https://github.com/mui-org/material-ui/issues/24109');
    const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');
    document.head.prepend(...elements);
  }, []);
  return children;
};
