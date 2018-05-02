import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import classNames from 'classnames';


const FormComponentUi = (props) => {
  const {
    inputClassName,
    name,
    input,
    beforeComponent,
    afterComponent,
    renderExtraComponent,
    renderComponent,
    renderClear,
    getErrors,
    showCharsRemaining,
    charsRemaining,
  } = props;
  
  const errors = getErrors();
  const hasErrors = errors && errors.length;
  
  const inputName = typeof input === 'function' ? input.name : input;
  const inputClass = classNames('form-input', inputClassName, `input-${name}`, 
    `form-component-${inputName || 'default'}`, { 'input-error': hasErrors, });
  
  return (
    <div className={inputClass}>
      {renderExtraComponent(beforeComponent)}
      {renderComponent()}
      {hasErrors ? <Components.FieldErrors errors={errors}/> : null}
      {renderClear()}
      {showCharsRemaining() &&
        <div className={classNames('form-control-limit', { danger: charsRemaining < 10 })}>
          {charsRemaining}
        </div>
      }
      {renderExtraComponent(afterComponent)}
    </div>
  );
};


FormComponentUi.propTypes = {
  inputClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.any,
  beforeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  afterComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  renderExtraComponent: PropTypes.func.isRequired,
  renderComponent: PropTypes.func.isRequired,
  renderClear: PropTypes.func.isRequired,
  getErrors: PropTypes.func.isRequired,
  help: PropTypes.any,
  showCharsRemaining: PropTypes.func.isRequired,
  charsRemaining: PropTypes.number,
  charsCount: PropTypes.number,
  charsMax: PropTypes.number,
};


FormComponentUi.displayName = 'FormComponentUi';


registerComponent('FormComponentUi', FormComponentUi);
