import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import classNames from 'classnames';
import { registerComponent } from 'meteor/vulcan:core';

class FormGroup extends PureComponent {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.renderHeading = this.renderHeading.bind(this);
    this.state = {
      collapsed: props.startCollapsed || false,
    };
  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  renderHeading() {
    return (
      <div className="form-section-heading" onClick={this.toggle}>
        <h3 className="form-section-heading-title">{this.props.label}</h3>
        <span className="form-section-heading-toggle">
          {this.state.collapsed ? <Components.Icon name="expand" /> : <Components.Icon name="collapse" />}
        </span>
      </div>
    );
  }

  render() {

    // if at least one of the fields in the group has an error, the group as a whole has an error
    const hasErrors = _.some(this.props.fields, field => {
      return !!this.props.errors.filter(error => error.data.name === field.path).length
    });

    return (
      <div className="form-section">
        {this.props.name === 'default' ? null : this.renderHeading()}
        <div className={classNames({ 'form-section-collapsed': this.state.collapsed && !hasErrors })}>
          {this.props.fields.map(field => (
            <Components.FormComponent
              key={field.name}
              {...field}
              updateCurrentValues={this.props.updateCurrentValues}
              formType={this.props.formType}
              currentValues={this.props.currentValues}
              errors={this.props.errors}
            />
          ))}
        </div>
      </div>
    );
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  fields: PropTypes.array,
  updateCurrentValues: PropTypes.func,
};

registerComponent('FormGroup', FormGroup);
