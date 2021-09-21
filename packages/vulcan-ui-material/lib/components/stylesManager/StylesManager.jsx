/**
 * Technical package that manages Styles injection order
 * for Material UI (particularly important during v4 to v5 conversion where
 * styled components and mui coexists)
 *
 * // @see https://styled-components.com/docs/advanced#server-side-rendering
 * // @see https://github.com/mui-org/material-ui/issues/24109#issuecomment-919354562
 */
import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import { StyledEngineProvider } from '@mui/material/styles';

const StylesManager = ({ children, ...otherProps }) => {
  return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
};

registerComponent('StylesManager', StylesManager);
