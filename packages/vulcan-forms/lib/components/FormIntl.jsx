import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Locales } from 'meteor/vulcan:core';

class FormIntl extends PureComponent {

  /*

  Note: ideally we'd try to make sure to return the right path no matter
  the order translations are stored in, but in practice we can't guarantee it
  so we just use the order of the Locales array.

  */
  getLocalePath = (locale, defaultIndex) => {
    return `${this.props.path}_intl.${defaultIndex}`;
  }

  render() {

    // do not pass FormIntl's own value, inputProperties, and intlInput props down
    const properties = _.omit(this.props, 'value', 'inputProperties', 'intlInput');

    return (
      <div className="form-intl">
        {Locales.map((locale, i) => (
          <div className={`form-intl-${locale.id}`} key={locale.id}>
            <Components.FormComponent {...properties} label={`${this.props.label} (${locale.id})`} path={this.getLocalePath(locale.id, i)} locale={locale.id} />
          </div>
        ))}
      </div>
    );
  }
}

registerComponent('FormIntl', FormIntl);
