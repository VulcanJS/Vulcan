import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { instantiateComponent } from 'meteor/vulcan:core';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

class FormGroup extends PureComponent {

  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.renderHeading = this.renderHeading.bind(this);
    this.state = {
      collapsed: props.group.startCollapsed || false,
    };
  }

  toggle () {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  renderHeading (FormComponents) {
    return (
      <FormComponents.FormGroupHeader
        toggle={this.toggle}
        label={this.props.label}
        collapsed={this.state.collapsed}
        hidden={this.isHidden()}
        group={this.props.group}
      />
    );
  }

  // if at least one of the fields in the group has an error, the group as a whole has an error
  hasErrors = () =>
    _.some(this.props.fields, field => {
      return !!this.props.errors.filter(error => error.path === field.path).length;
    });

  isHidden = () => {
    const { hidden, document } = this.props;
    const isHidden = typeof hidden === 'function' ? hidden({ ...this.props, document }) : hidden || false;
    return isHidden;
  };

  render() {
    if (this.props.group.adminsOnly && !Users.isAdmin(this.props.currentUser)) {
      return null;
    }

    const { name, fields, formComponents, label, group, document } = this.props;
    const { collapsed } = this.state;

    const FormComponents = mergeWithComponents(formComponents);
    const anchorName = name.split('.').length > 1 ? name.split('.')[1] : name;

    return (
      <FormComponents.FormGroupLayout
        label={label}
        anchorName={anchorName}
        toggle={this.toggle}
        collapsed={collapsed}
        hidden={this.isHidden()}
        group={group}
        heading={name === 'default' ? null : this.renderHeading(FormComponents)}
        hasErrors={this.hasErrors()}
        document={document}
      >

        {instantiateComponent(group.beforeComponent, this.props)}

        {fields.map(field => (
          <FormComponents.FormComponent
            key={field.name}
            disabled={this.props.disabled}
            {...field}
            document={document}
            itemProperties={{ ...this.props.itemProperties, ...field.itemProperties }}
            errors={this.props.errors}
            throwError={this.props.throwError}
            currentValues={this.props.currentValues}
            updateCurrentValues={this.props.updateCurrentValues}
            deletedValues={this.props.deletedValues}
            addToDeletedValues={this.props.addToDeletedValues}
            clearFieldErrors={this.props.clearFieldErrors}
            formType={this.props.formType}
            currentUser={this.props.currentUser}
            prefilledProps={this.props.prefilledProps}
            submitForm={this.props.submitForm}
            formComponents={FormComponents}
          />
        ))}

        {instantiateComponent(group.afterComponent, this.props)}
      </FormComponents.FormGroupLayout>
    );
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  hidden: PropTypes.func,
  fields: PropTypes.array.isRequired,
  group: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  throwError: PropTypes.func.isRequired,
  currentValues: PropTypes.object.isRequired,
  updateCurrentValues: PropTypes.func.isRequired,
  deletedValues: PropTypes.array.isRequired,
  addToDeletedValues: PropTypes.func.isRequired,
  clearFieldErrors: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
  prefilledProps: PropTypes.object,
};

export default FormGroup;

registerComponent('FormGroup', FormGroup);
