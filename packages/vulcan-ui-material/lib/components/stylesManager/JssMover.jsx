import { useEffect, useState } from 'react';
import debug from 'debug';
const debugJss = debug('vulcan:jss');

/**
 * A quickfix to move JSS styles upper in the tree
 */
export const JssMover = ({ children }) => {
  const [elems, setElems] = useState([]);
  // We need this check when NoSsr is set, because the elments might not be there
  useEffect(() => {
    const checkJss = setInterval(function() {
      const elements = document.querySelectorAll('[data-jss][data-meta^=Mui],[data-jss][data-meta=ForwardRef]');
      debugJss('Waiting for jss to be applied...');
      if (elements.length) {
        setElems(elements);
        clearInterval(checkJss);
      }
    }, 100);
    return () => {
      clearInterval(checkJss);
    };
  }, []);
  useEffect(
    () => {
      console.warn('JssMover component moves data-jss styles to the top');
      console.warn('See https://github.com/mui-org/material-ui/issues/24109');
      document.head.prepend(...elems);
    },
    [elems.length]
  );
  return children;
};
