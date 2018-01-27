import React from 'react';
import { Textarea } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = ({refFunction, ...properties}) => <Textarea ref={refFunction} {...properties}/>

registerComponent('FormComponentTextarea', TextareaComponent);