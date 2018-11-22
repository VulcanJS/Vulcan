import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, Locales } from 'meteor/vulcan:core';
import omit from 'lodash/omit';
import getContext from 'recompose/getContext';
import mergeWithComponents from '../modules/mergeWithComponents';

// replaceable layout
const FormIntlLayout = ({ children }) => (
  <div className="form-intl">{children}</div>
);
registerComponent({ name: 'FormIntlLayout', component: FormIntlLayout });
const FormIntlItemLayout = ({ locale, children }) => (
  <div className={`form-intl-${locale.id}`}>
    {children}
  </div>
);
registerComponent({
  name: 'FormIntlItemLayout',
  component: FormIntlItemLayout
});

class FormIntl extends PureComponent {
  /*

  Note: ideally we'd try to make sure to return the right path no matter
  the order translations are stored in, but in practice we can't guarantee it
  so we just use the order of the Locales array.

  */
  getLocalePath = defaultIndex => {
    return `${this.props.path}_intl.${defaultIndex}`;
  };

  render() {
    const { name, formComponents } = this.props;
    const FormComponents = mergeWithComponents(formComponents);

    // do not pass FormIntl's own value, inputProperties, and intlInput props down
    const properties = omit(
      this.props,
      'value',
      'inputProperties',
      'intlInput',
      'nestedInput'
    );
    return (
      <FormComponents.FormIntlLayout>
        {Locales.map((locale, i) => (
          <FormComponents.FormIntlItemLayout key={locale.id} locale={locale}>
            <FormComponents.FormComponent
              {...properties}
              label={this.props.getLabel(name, locale.id)}
              path={this.getLocalePath(i)}
              locale={locale.id}
            />
          </FormComponents.FormIntlItemLayout>
        ))}
      </FormComponents.FormIntlLayout>
    );
  }
}

FormIntl.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  formComponents: PropTypes.object
};

registerComponent(
  'FormIntl',
  FormIntl,
  getContext({
    getLabel: PropTypes.func
  })
);
