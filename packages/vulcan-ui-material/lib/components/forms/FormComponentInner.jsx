import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent, instantiateComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import _omit from 'lodash/omit';
import classNames from 'classnames';


const styles = theme => ({
  
  formInput: {
    position: 'relative',
    marginBottom: theme.spacing.unit * 3,
  },
  
  halfWidthLeft: {
    display: 'inline-block',
    width: '48%',
    verticalAlign: 'top',
    marginRight: '4%',
  },
  
  halfWidthRight: {
    display: 'inline-block',
    width: '48%',
    verticalAlign: 'top',
  },
  
  thirdWidthLeft: {
    display: 'inline-block',
    width: '31%',
    verticalAlign: 'top',
    marginRight: '3.5%',
  },
  
  thirdWidthRight: {
    display: 'inline-block',
    width: '31%',
    verticalAlign: 'top',
  },
  
  hidden: {
    display: 'none',
  },
  
});


class FormComponentInner extends PureComponent {
  
  getProperties = () => {
    return _omit(this.props, 'classes');
  };
  
  render () {
    const {
      classes,
      inputClassName,
      name,
      input,
      hidden,
      beforeComponent,
      afterComponent,
      formInput,
      intlInput,
      nestedInput,
      formComponents,
    } = this.props;
  
    const FormComponents = formComponents;
    
    const inputClass = classNames(
      classes.formInput,
      hidden && classes.hidden,
      inputClassName && classes[inputClassName],
      `input-${name}`,
      `form-component-${input || 'default'}`
    );
    
    const properties = this.getProperties();
  
    const FormInput = formInput;
  
    if (intlInput) {
      return <Components.FormIntl {...properties} />;
    } else if (nestedInput){
      return <Components.FormNested {...properties} />;
    } else {
      return (
        <div className={inputClass}>
          {instantiateComponent(beforeComponent, properties)}
          <FormInput {...properties}/>
          {instantiateComponent(afterComponent, properties)}
        </div>
      );
    }
    
  }
}


FormComponentInner.contextTypes = {
  intl: intlShape,
};


FormComponentInner.propTypes = {
  classes: PropTypes.object.isRequired,
  inputClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.any,
  beforeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  afterComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  errors: PropTypes.array.isRequired,
  help: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  showCharsRemaining: PropTypes.bool.isRequired,
  charsRemaining: PropTypes.number,
  charsCount: PropTypes.number,
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  formInput: PropTypes.func.isRequired,
};


FormComponentInner.displayName = 'FormComponentInner';


registerComponent('FormComponentInner', FormComponentInner, [withStyles, styles]);
