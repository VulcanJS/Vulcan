import React from 'react';
import { Form } from 'react-bootstrap';
import { registerComponent } from 'meteor/vulcan:core';

const RadioGroupComponent = ({refFunction, inputProperties, ...properties}) => <Form.Check {...inputProperties} ref={refFunction}/>;

registerComponent('FormComponentRadioGroup', RadioGroupComponent);