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
          {this.state.collapsed ? <Components.IconRight height={16} width={16}/> : <Components.IconDown height={16} width={16} />}
        </span>
      </div>
    );
  }

  // if at least one of the fields in the group has an error, the group as a whole has an error
  hasErrors = () => _.some(this.props.fields, field => {
    return !!this.props.errors.filter(error => error.path === field.path).length
  });

  render() {

    return (
      <div className="form-section">
        {this.props.name === 'default' ? null : this.renderHeading()}
        <div className={classNames({ 'form-section-collapsed': this.state.collapsed && !this.hasErrors() })}>
          {this.props.fields.map(field => (
            <Components.FormComponent
              key={field.name}
              {...field}
              errors={this.props.errors}
              throwError={this.props.throwError}
              currentValues={this.props.currentValues}
              updateCurrentValues={this.props.updateCurrentValues}
              deletedValues={this.props.deletedValues}
              addToDeletedValues={this.props.addToDeletedValues}
              clearFieldErrors={this.props.clearFieldErrors}
              formType={this.props.formType}
              currentUser={this.props.currentUser}
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

const IconRight = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <polyline
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      points="5.5,23.5 18.5,12 5.5,0.5"
      id="Outline_Icons"
    />
    <rect fill="none" width="24" height="24" id="Frames-24px" />
  </svg>
);

registerComponent('IconRight', IconRight);

const IconDown = ({ width = 24, height = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
  >
    <polyline
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      points="0.501,5.5 12.001,18.5 23.501,5.5"
      id="Outline_Icons"
    />
    <rect fill="none" width="24" height="24" id="Frames-24px" />
  </svg>
);

registerComponent('IconDown', IconDown);
