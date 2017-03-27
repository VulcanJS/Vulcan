import React, { PropTypes, Component } from 'react';
import FormComponent from "./FormComponent.jsx";

class FormGroup extends Component {
  render() {
    return (
      <div className="form-section">
        {this.props.name === "default" ? null : <h3 className="form-section-heading">{this.props.label}</h3>}
        {this.props.fields.map(field => <FormComponent key={field.name} {...field} updateCurrentValues={this.props.updateCurrentValues} />)}
      </div>
    )
  }
}

FormGroup.propTypes = {
  name: React.PropTypes.string,
  label: React.PropTypes.string,
  order: React.PropTypes.number,
  fields: React.PropTypes.array,
  updateCurrentValues: React.PropTypes.func
}

export default FormGroup;