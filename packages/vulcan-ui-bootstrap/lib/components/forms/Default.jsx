import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class Default extends React.PureComponent {
  render() {
    const {refFunction, inputProperties, ...properties} = this.props;
    return <Input {...inputProperties} ref={refFunction} type='text' />;
  }
}

registerComponent('FormComponentDefault', Default);
