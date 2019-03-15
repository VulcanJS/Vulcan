import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, replaceComponent, instantiateComponent, } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    minWidth: '320px'
  },
  paper: {
    padding: theme.spacing.unit * 3
  },
  subtitle1: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit * 5,
    marginBottom: theme.spacing.unit,
    color: theme.palette.primary[500],
  },
  collapsible: {
    cursor: 'pointer',
  },
  label: {},
  toggle: {
    '& svg': {
      width: 21,
      height: 21,
      display: 'block',
    }
  },
  container: {
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: -4,
    marginRight: -4,
  },
  entered: {
    overflow: 'visible',
  },
});


class FormGroup extends PureComponent {
  
  
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
    const { classes, label } = this.props;
    const collapsible = this.props.collapsible || this.isAdmin;
    
    return (
      <Typography className={classNames(classes.subtitle1, collapsible && classes.collapsible)}
                  variant="subtitle1"
                  onClick={this.toggle}
      >
    
        <div className={classes.label}>
          {label}
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
          name === 'default'
            ?
            null
            :
            this.renderHeading()
        }
        
        <Collapse classes={{ container: classes.container, entered: classes.entered }} in={collapseIn}>
          <Paper className={classes.paper}>
            
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
          
          </Paper>
        </Collapse>
      
      </div>
    );
  }
  
  
}


FormGroup.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  order: PropTypes.number,
  hidden: PropTypes.bool,
  fields: PropTypes.array,
  collapsible: PropTypes.bool,
  startCollapsed: PropTypes.bool,
  updateCurrentValues: PropTypes.func,
  startComponent: PropTypes.node,
  endComponent: PropTypes.node,
  currentUser: PropTypes.object,
};


replaceComponent('FormGroup', FormGroup, [withStyles, styles]);
