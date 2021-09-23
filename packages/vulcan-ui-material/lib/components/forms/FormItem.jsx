/*

Layout for a single form item

*/

import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';

// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';

const FormItem = props => {
  const {
    path,
    label,
    children,
    beforeInput,
    afterInput,
    description,
    layout = 'horizontal',
    loading,
    Components: propsComponents,
    ...rest
  } = props;
  const innerComponent = loading ? <Components.FormInputLoading loading={loading}>{children}</Components.FormInputLoading> : children;

  const Components = mergeWithComponents(propsComponents);

  if (layout === 'inputOnly' || !label) {
    // input only layout
    return (
      <FormGroup /*controlId={path}*/>
        {beforeInput}
        {innerComponent}
        {afterInput}
        {description && <FormHelperText {...props} />}
      </FormGroup>
    );
  } else if (layout === 'vertical') {
    // vertical layout
    return (
      <FormGroup /*controlId={path}*/>
        <FormLabel {...props} />
        <div className="form-item-contents">
          <div className="form-item-input">
            {beforeInput}
            {innerComponent}
            {afterInput}
          </div>
          {description && <FormHelperText {...props} />}
        </div>
      </FormGroup>
    );
  } else {
    // horizontal layout (default)
    return (
      <FormGroup /*as={Row} controlId={path}*/>
        <FormLabel layout="horizontal" {...props} />
        <Grid item sm={9}>
          {beforeInput}
          {innerComponent}
          {afterInput}
          {description && <FormHelperText {...props} />}
        </Grid>
      </FormGroup>
    );
  }
};

registerComponent('FormItem', FormItem);
