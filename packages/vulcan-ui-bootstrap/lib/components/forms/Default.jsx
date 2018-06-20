import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

const Default = ({ refFunction, inputProperties }) => (
  <FormGroup
    controlId="formBasicText"
    // validationState={this.getValidationState()}
  >
    <ControlLabel>{inputProperties.label}</ControlLabel>
    <FormControl type="text" {...inputProperties} ref={refFunction} />
    {/* <FormControl.Feedback /> */}
    {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
  </FormGroup>
);

registerComponent('FormComponentDefault', Default);
