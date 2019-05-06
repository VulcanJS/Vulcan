import React from 'react';
import PropTypes from 'prop-types';
import { instantiateComponent, registerComponent, Utils } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';


const styles = theme => ({
  
  root: {
    minWidth: '320px'
  },

});


const FormGroupHeaderNone = () => {
  return null;
};


registerComponent('FormGroupHeaderNone', FormGroupHeaderNone, [withStyles, styles]);


const FormGroupLayoutNone = ({ label, collapsed, hasErrors, heading, group, children, classes }) => {
  const name = group.name.split('.').length > 1 ? group.name.split('.')[1] : group.name;
  
  return (
    <div className={classNames(classes.root, 'form-section', `form-section-${name}`)}>
      
      <a name={name}/>
  
      {instantiateComponent(group.startComponent)}
  
      {children}
  
      {instantiateComponent(group.endComponent)}
    
    </div>
  );
};


FormGroupLayoutNone.propTypes = {
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  heading: PropTypes.node,
  group: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};


registerComponent('FormGroupLayoutNone', FormGroupLayoutNone, [withStyles, styles]);

