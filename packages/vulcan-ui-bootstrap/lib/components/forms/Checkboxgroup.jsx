import React from 'react';
import { CheckboxGroup } from 'formsy-react-components';
import { registerComponent } from 'meteor/vulcan:core';

class CheckboxGroupComponent {
  render() {
    const { refFunction, inputProperties, ...properties } = this.props;
    return <CheckboxGroup {...inputProperties} ref={refFunction} />;
  }
}

registerComponent('FormComponentCheckboxGroup', CheckboxGroupComponent);
