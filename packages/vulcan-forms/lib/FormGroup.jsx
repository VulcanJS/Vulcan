import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FormComponent from "./FormComponent.jsx";

class FormGroup extends PureComponent {
  render() {
    return (
      <div className="form-section">
        {this.props.name === 'default' ? null : <h3 className="form-section-heading">{this.props.label}</h3>}
        {this.props.fields.map(field => <FormComponent key={field.name} {...field} updateCurrentValues={this.props.updateCurrentValues} />)}
      </div>
    )
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  fields: PropTypes.array,
  updateCurrentValues: PropTypes.func
}

export default FormGroup;