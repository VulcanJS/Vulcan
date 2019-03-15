import React from 'react';
import MuiInput from '../base-controls/MuiInput';
import { registerComponent } from 'meteor/vulcan:core';


const TextareaComponent = ({ refFunction, ...properties }) =>
  <MuiInput {...properties}
            ref={refFunction}
            multiline={true}
            rows={properties.rows ? properties.rows : 2}
            rowsMax={10}
  />;


registerComponent('FormComponentTextarea', TextareaComponent);
