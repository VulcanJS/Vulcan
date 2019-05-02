import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const TextareaComponent = ({ refFunction, inputProperties, ...properties }) =>
  <MuiInput {...properties}
            ref={refFunction}
            multiline={true}
            inputProperties={inputProperties}
            rows={inputProperties.rows ? inputProperties.rows : 2}
            rowsMax={10}
  />;


registerComponent('FormComponentTextarea', TextareaComponent);
