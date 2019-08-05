import { instantiateComponent, registerComponent } from 'meteor/vulcan:lib';
import PropTypes from 'prop-types';
import React from 'react';

// Replaceable layout, default implementation
const FormNestedArrayLayout = (props) => {
  const {
    hasErrors,
    nestedArrayErrors,
    label,
    addItem,
    beforeComponent,
    afterComponent,
    formComponents,
    children,
  } = props;
  const FormComponents = formComponents;

  return (
    <div className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}>

      {instantiateComponent(beforeComponent, props)}

      <label className="control-label col-sm-3">{label}</label>

      <div className="col-sm-9">
        {children}
        {
          addItem &&

          <FormComponents.Button className="form-nested-button" size="sm" variant="success" onClick={addItem}>
            <FormComponents.IconAdd height={12} width={12} />
          </FormComponents.Button>
        }
        {
          props.hasErrors
            ?
            <FormComponents.FieldErrors key="form-nested-errors" errors={nestedArrayErrors} />
            :
            null
        }
      </div>

      {instantiateComponent(afterComponent, props)}

    </div>
  );
};

FormNestedArrayLayout.propTypes = {
  hasErrors: PropTypes.bool.isRequired,
  nestedArrayErrors: PropTypes.array,
  label: PropTypes.node,
  hideLabel: PropTypes.bool,
  addItem: PropTypes.func,
  beforeComponent: PropTypes.node,
  afterComponent: PropTypes.node,
  formComponents: PropTypes.object,
  children: PropTypes.node,
};

registerComponent({
  name: 'FormNestedArrayLayout',
  component: FormNestedArrayLayout,
});

export default FormNestedArrayLayout;
