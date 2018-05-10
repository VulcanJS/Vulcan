import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Locales } from 'meteor/vulcan:core';

class FormIntl extends PureComponent {
  render() {
    // do not pass FormIntl's own value, inputProperties, and intlInput props down
    const properties = _.omit(this.props, 'value', 'inputProperties', 'intlInput');

    return (
      <div className="form-intl">
        {Locales.map(locale => (
          <div className={`form-intl-${locale.id}`} key={locale.id}>
            <Components.FormComponent {...properties} label={`${this.props.label} (${locale.label})`} locale={locale.id} />
          </div>
        ))}
      </div>
    );
  }
}

registerComponent('FormIntl', FormIntl);
