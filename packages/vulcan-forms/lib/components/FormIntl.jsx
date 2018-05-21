import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Locales } from 'meteor/vulcan:core';

class FormIntl extends PureComponent {

  /*

  If translations already exist, try to make sure they're loaded and stored in the same order.
  If not, use order of Locales array.
  
  */
  getLocalePath = (locale, defaultIndex) => {
    const translations = this.props.value;
    const index = translations && !!translations.length ? translations.findIndex(t => t.locale === locale) : defaultIndex;
    return `${this.props.path}_intl.${index}`;
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
