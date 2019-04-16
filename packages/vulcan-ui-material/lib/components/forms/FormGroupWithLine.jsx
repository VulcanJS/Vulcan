import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, instantiateComponent } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    minWidth: '320px',
  },
  divider: {
    marginLeft: theme.spacing.unit * -3,
    marginRight: theme.spacing.unit * -3,
  },
  subtitle1: {
    marginTop: theme.spacing.unit * 5,
    position: 'relative',
  },
  collapsible: {
    cursor: 'pointer',
  },
  typography: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& > div:first-child': {
      ...theme.typography.subtitle1,
    },
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  toggle: {
    color: theme.palette.action.active,
  },
  entered: {
    overflow: 'visible',
  },
});


class FormGroupWithLine extends PureComponent {
  
  constructor (props) {
    super(props);
    
    this.isAdmin = props.name === 'admin';
    
    this.state = {
      collapsed: props.startCollapsed || this.isAdmin,
    };
  }
  
  
  toggle = () => {
    const collapsible = this.props.collapsible || this.isAdmin;
    if (!collapsible) return;
    
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  
  
  renderHeading = () => {
    const { classes } = this.props;
    const collapsible = this.props.collapsible || this.isAdmin;
    
    return (
      <div className={classNames(classes.subtitle1, collapsible && classes.collapsible)} onClick={this.toggle}>
        
        <Divider className={classes.divider}/>
        
        <Typography className={classes.typography} variant="subtitle1" gutterBottom>
          <div>
            {this.props.label}
          </div>
          {
            collapsible &&
            
            <div className={classes.toggle}>
              {
                this.state.collapsed
                  ?
                  <ExpandMoreIcon/>
                  :
                  <ExpandLessIcon/>
              }
            </div>
          }
        </Typography>
      
      </div>
    );
  };
  
  
  // if at least one of the fields in the group has an error, the group as a whole has an error
  hasErrors = () => _.some(this.props.fields, field => {
    return !!this.props.errors.filter(error => error.path === field.path).length;
  });
  
  
  render () {
    const {
      name,
      hidden,
      classes,
      currentUser,
    } = this.props;
    
    if (this.isAdmin && !Users.isAdmin(currentUser)) {
      return null;
    }
    
    if (typeof hidden === 'function' ? hidden({ ...this.props }) : hidden) {
      return null;
    }
    
    //do not display if no fields, no startComponent and no endComponent
    if (!this.props.startComponent && !this.props.endComponent && !this.props.fields.length) {
      return null;
    }
    
    const anchorName = name.split('.').length > 1 ? name.split('.')[1] : name;
    const collapseIn = !this.state.collapsed || this.hasErrors();
  
    const FormComponents = this.props.formComponents;
  
    return (
      <div className={classes.root}>
        
        <a name={anchorName}/>
        
        {
          this.props.name === 'default'
            ?
            null
            :
            this.renderHeading()
        }
        
        <Collapse classes={{ entered: classes.entered }} in={collapseIn}>
          
          {instantiateComponent(this.props.startComponent)}
          
          {this.props.fields.map(field => (
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
          
          {instantiateComponent(this.props.endComponent)}
        
        </Collapse>
      
      </div>
    );
  }
}


FormGroupWithLine.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  fields: PropTypes.array,
  collapsible: PropTypes.bool,
  startCollapsed: PropTypes.bool,
  updateCurrentValues: PropTypes.func,
  startComponent: PropTypes.node,
  endComponent: PropTypes.node,
  currentUser: PropTypes.object,
};


registerComponent('FormGroupWithLine', FormGroupWithLine, [withStyles, styles]);
