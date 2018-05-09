import React from 'react';
import { Textarea } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class TextareaComponent extends React.PureComponent {
  render(){
    const {refFunction, inputProperties, ...properties} = this.props;
    return <Textarea ref={refFunction} {...inputProperties}/>;
  }
}

registerComponent('FormComponentTextarea', TextareaComponent);
