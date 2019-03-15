import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Components,
  registerComponent,
  instantiateComponent,
} from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import Users from 'meteor/vulcan:users';
import classNames from 'classnames';


const styles = theme => ({
  root: {
    minWidth: '320px'
  },
});


class FormGroupNone extends PureComponent {
  
  
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
  
    const FormComponents = this.props.formComponents;
  
    return (
      <div className={classes.root}>
        
        <a name={anchorName}/>
        
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
      
      </div>
    );
  }
  
  
}


FormGroupNone.propTypes = {
  name: PropTypes.string,
  order: PropTypes.number,
  hidden: PropTypes.bool,
  fields: PropTypes.array,
  updateCurrentValues: PropTypes.func,
  startComponent: PropTypes.node,
  endComponent: PropTypes.node,
  currentUser: PropTypes.object,
};


registerComponent('FormGroupNone', FormGroupNone, [withStyles, styles]);
