import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';


const styles = theme => ({
  
  root: {
    minWidth: '320px'
  },
  
  hidden: {
    display: 'none',
  }

});


const FormGroupHeaderNone = () => {
  return null;
};


registerComponent('FormGroupHeaderNone', FormGroupHeaderNone, [withStyles, styles]);


const FormGroupLayoutNone = ({ label, anchorName, collapsed, hidden, hasErrors, heading, group, children, classes }) => {
  return (
    <div className={classNames(classes.root, hidden && classes.hidden,'form-section', `form-section-${anchorName}`)}>
      
      <a name={anchorName}/>
  
      {children}
    
    </div>
  );
};


FormGroupLayoutNone.propTypes = {
  label: PropTypes.string.isRequired,
  anchorName: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  hidden: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  heading: PropTypes.node,
  group: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};


registerComponent('FormGroupLayoutNone', FormGroupLayoutNone, [withStyles, styles]);

