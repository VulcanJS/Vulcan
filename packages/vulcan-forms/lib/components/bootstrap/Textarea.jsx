import React from 'react';
import PropTypes from 'prop-types';
import { Textarea } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

const TextareaComponent = properties => <Textarea {...properties}/>

registerComponent('FormComponentTextarea', TextareaComponent);