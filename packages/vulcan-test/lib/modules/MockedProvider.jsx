/**
 * Need this to both avoid this bug in react-apollo version >2.5.2
 * https://github.com/apollographql/react-apollo/issues/2900#issuecomment-530092357
 * and this feature only added in 2.5.3 (childProps passed down)
 * https://github.com/apollographql/react-apollo/pull/2482/files
 *
 * NOTE: the fix will be obsolete when we update to 3.x.x which won't be affected by those issues
 */

// in react-apollo v3, this will be imported from the independant package "@apollo/react-testing" instead
// currently we use v2
import { MockedProvider } from 'react-apollo/test-utils';
import React from 'react';

const ExtendedMockedProvider = props => {
  return (
    <MockedProvider {...props}>
      {React.cloneElement(props.children, { ...(props.childProps || {}) })}
    </MockedProvider>
  );
};
export default ExtendedMockedProvider;
