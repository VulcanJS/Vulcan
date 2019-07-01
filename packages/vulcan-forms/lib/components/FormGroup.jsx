import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, instantiateComponent, Utils } from 'meteor/vulcan:core';
import classNames from 'classnames';
import { registerComponent, mergeWithComponents } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const FormGroupHeader = ({ toggle, collapsed, label }) => (
  <div className="form-section-heading" onClick={toggle}>
    <h3 className="form-section-heading-title">{label}</h3>
    <span className="form-section-heading-toggle">
      {collapsed ? (
        <Components.IconRight height={16} width={16}/>
      ) : (
        <Components.IconDown height={16} width={16}/>
      )}
    </span>
  </div>
);
FormGroupHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
  group: PropTypes.object,
};
registerComponent({ name: 'FormGroupHeader', component: FormGroupHeader });

const FormGroupLayout = ({ children, label, anchorName, heading, collapsed, group, hasErrors }) => (
  <div className={`form-section form-section-${anchorName} form-section-${Utils.slugify(label)}`}>
    <a name={anchorName}/>
    {heading}
    <div
      className={classNames({
        'form-section-collapsed': collapsed && !hasErrors
      })}
    >
      {children}
    </div>
  </div>
);
FormGroupLayout.propTypes = {
  label: PropTypes.string,
  anchorName: PropTypes.string,
  heading: PropTypes.node,
  collapsed: PropTypes.bool,
  group: PropTypes.object,
  hasErrors: PropTypes.bool,
  children: PropTypes.node
};
registerComponent({ name: 'FormGroupLayout', component: FormGroupLayout });

class FormGroup extends PureComponent {
  constructor (props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.renderHeading = this.renderHeading.bind(this);
    this.state = {
      collapsed: props.group.startCollapsed || false
    };
  }
  
  toggle () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  
  renderHeading (FormComponents) {
    return (
      <FormComponents.FormGroupHeader
        toggle={this.toggle}
        label={this.props.label}
        collapsed={this.state.collapsed}
        group={this.props.group}
      />
    );
  }
  
  // if at least one of the fields in the group has an error, the group as a whole has an error
  hasErrors = () =>
    _.some(this.props.fields, field => {
      return !!this.props.errors.filter(error => error.path === field.path)
        .length;
    });
  
  render () {
    if (this.props.group.adminsOnly && !Users.isAdmin(this.props.currentUser)) {
      return null;
    }
  
    const { name, fields, formComponents, label, group } = this.props;
    const { collapsed } = this.state;
    
    const FormComponents = mergeWithComponents(formComponents);
    const anchorName = name.split('.').length > 1 ? name.split('.')[1] : name;
    
    return (
        <FormComponents.FormGroupLayout
          label={label}
          anchorName={anchorName}
          toggle={this.toggle}
          collapsed={collapsed}
          group={group}
          heading={name === 'default' ? null : this.renderHeading(FormComponents)}
          hasErrors={this.hasErrors()}
        >

          {instantiateComponent(group.beforeComponent)}

          {fields.map(field => (
            <FormComponents.FormComponent
              key={field.name}
              disabled={this.props.disabled}
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
              formComponents={FormComponents}
            />
          ))}
  
          {instantiateComponent(group.afterComponent)}

        </FormComponents.FormGroupLayout>
    );
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
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
  currentUser: PropTypes.object
};

export default FormGroup;

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
    <rect fill="none" width="24" height="24" id="Frames-24px"/>
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
    <rect fill="none" width="24" height="24" id="Frames-24px"/>
  </svg>
);

registerComponent('IconDown', IconDown);
