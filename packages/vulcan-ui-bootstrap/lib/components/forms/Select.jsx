import React from 'react';
import { Select } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class SelectComponent extends React.PureComponent {
  render(){
    console.log(this.props.name);
    const {refFunction, inputProperties, ...properties} = this.props;
    return <Select ref={refFunction} {...inputProperties}/>;
  }
}

registerComponent('FormComponentSelect', SelectComponent);
