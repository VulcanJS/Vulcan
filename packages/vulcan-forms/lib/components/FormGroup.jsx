import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
    formSection: {
      fontFamily: theme.typography.fontFamily,
      border: `solid 1px ${theme.palette.grey[400]}`,
      marginBottom: theme.spacing.unit,
    },
    formSectionFields: {
      paddingRight: theme.spacing.unit*2,
      paddingLeft: theme.spacing.unit*2,
    },
    formSectionBody: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      borderTop: `solid 1px ${theme.palette.grey[300]}`,
    },
    formSectionHeading: {
      display:"flex",
      justifyContent: "space-between",
      paddingTop: theme.spacing.unit*2,
      paddingRight: theme.spacing.unit*2,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit*2,
    },
    flex: {
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap"
    }
})

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
    const { classes, label } = this.props
    return (
      <div className={classes.formSectionHeading} onClick={this.toggle}>
        <h3 className="form-section-heading-title">{ label }</h3>
        <span>
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
    const { classes, name, defaultStyle, flexStyle} = this.props
    const groupStyling = !(name == 'default' || defaultStyle)
    return (
      <div className={groupStyling && classes.formSection}>
        { groupStyling && this.renderHeading()}
        { (!this.state.collapsed || this.hasErrors()) &&
          <div className={classNames(classes.formSectionFields, {[classes.formSectionBody]: groupStyling, [classes.flex]: flexStyle})}
            >
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
        }
      </div>
    );
  }
}

FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  fields: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  throwError: PropTypes.func.isRequired,
  currentValues: PropTypes.object.isRequired,
  updateCurrentValues: PropTypes.func.isRequired,
  deletedValues: PropTypes.array.isRequired,
  addToDeletedValues: PropTypes.func.isRequired,
  clearFieldErrors: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

registerComponent('FormGroup', FormGroup, withStyles(styles));

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
