import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';

const FormClear = ({ clearField, inputType, disabled }, { intl }) => {
  if (['date', 'date2', 'datetime', 'time', 'select', 'radiogroup'].includes(inputType) && !disabled) {
    return (
      <Components.TooltipTrigger
        trigger={
          <button className="form-component-clear" title={intl.formatMessage({ id: 'forms.clear_field' })} onClick={clearField}>
            <span>✕</span>
          </button>
        }>
        <Components.FormattedMessage id="forms.clear_field" />
      </Components.TooltipTrigger>
    );
  } else {
    return null;
  }
};

FormClear.contextTypes = {
  intl: intlShape,
};

registerComponent('FormClear', FormClear);
