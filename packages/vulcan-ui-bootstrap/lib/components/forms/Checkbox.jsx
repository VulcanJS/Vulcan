import React from 'react';
import { Checkbox } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class CheckboxComponent {
  render() {
    const { refFunction, inputProperties, ...properties } = this.props;
    return <Checkbox {...inputProperties} ref={refFunction} />;
  }
}
registerComponent('FormComponentCheckbox', CheckboxComponent);
