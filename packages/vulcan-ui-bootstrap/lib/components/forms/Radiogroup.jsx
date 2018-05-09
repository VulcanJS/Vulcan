import React from 'react';
import { RadioGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class RadioGroupComponent extends React.PureComponent {
  render() {
    const {refFunction, inputProperties, ...properties} = this.props;
    return <RadioGroup {...inputProperties} ref={refFunction}/>;
  }
}

registerComponent('FormComponentRadioGroup', RadioGroupComponent);
