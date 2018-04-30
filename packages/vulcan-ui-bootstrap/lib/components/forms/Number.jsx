import React from 'react';
import { Input } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class NumberComponent extends React.PureComponent {
  render() {
    const {refFunction, inputProperties, ...properties} = this.props;
    return <Input ref={refFunction} {...inputProperties} type="number"/>;
  }
}

registerComponent('FormComponentNumber', NumberComponent);
