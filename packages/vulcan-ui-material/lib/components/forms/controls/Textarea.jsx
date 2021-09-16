import React from 'react';
import FormInput from '../base-controls/FormInput';
import { registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = ({ refFunction, inputProperties, ...properties }) => (
  <FormInput
    {...properties}
    ref={refFunction}
    multiline={true}
    inputProperties={inputProperties}
    minRows={inputProperties.rows ? inputProperties.rows : 2}
    maxRows={10}
  />
);

registerComponent('FormComponentTextarea', TextareaComponent);
