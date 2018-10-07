import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Locales } from 'meteor/vulcan:core';
import omit from 'lodash/omit';
import getContext from 'recompose/getContext';

class FormIntl extends PureComponent {

  /*

  Note: ideally we'd try to make sure to return the right path no matter
  the order translations are stored in, but in practice we can't guarantee it
  so we just use the order of the Locales array.

  */
  getLocalePath = (defaultIndex) => {
    return `${this.props.path}_intl.${defaultIndex}`;
  }
  
  render() {

    const FormComponents = this.props.formComponents;

    // do not pass FormIntl's own value, inputProperties, and intlInput props down
    const properties = omit(this.props, 'value', 'inputProperties', 'intlInput', 'nestedInput');

    return (
      <div className="form-intl">
        {Locales.map((locale, i) => (
          <div className={`form-intl-${locale.id}`} key={locale.id}>
            <FormComponents.FormComponent {...properties} label={this.props.getLabel(this.props.name, locale.id)} path={this.getLocalePath(i)} locale={locale.id} />
          </div>
        ))}
      </div>
    );
  }
}

registerComponent('FormIntl', FormIntl, getContext({
  getLabel: PropTypes.func,
}));
