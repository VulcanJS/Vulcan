import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import classNames from 'classnames';


const styles = theme => ({
  
  layoutRoot: {
    minWidth: '320px',
    paddingBottom: theme.spacing.unit * 3,
  },
  
  headerRoot: {
    marginBottom: theme.spacing.unit * 3,
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


const FormGroupHeaderLine = ({ toggle, collapsed, label, group, classes }) => {
  const collapsible = group && group.collapsible || group && group.name === 'admin';
  
  return (
    <div className={classNames(classes.headerRoot, collapsible && classes.collapsible, 'form-section-heading')}
         onClick={collapsible ? toggle : null}
    >
      
      <Divider className={classes.divider}/>
      
      <Typography className={classes.typography} variant="subtitle1" gutterBottom>
        <div>
          {label}
        </div>
        {
          collapsible &&
          
          <div className={classes.toggle}>
            {
              collapsed
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


FormGroupHeaderLine.propTypes = {
  toggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};


FormGroupHeaderLine.displayName = 'FormGroupHeaderLine';


registerComponent('FormGroupHeaderLine', FormGroupHeaderLine, [withStyles, styles]);


const FormGroupLayoutLine = ({ label, anchorName, collapsed, hasErrors, heading, group, children, classes }) => {
  return (
    <div className={classNames(classes.layoutRoot, 'form-section', `form-section-${anchorName}`)}>
      
      <a name={anchorName}/>
      
      {heading}
      
      <Collapse classes={{ entered: classes.entered }} in={!collapsed || hasErrors}>
        
        {children}
      
      </Collapse>
    
    </div>
  );
};


FormGroupLayoutLine.propTypes = {
  label: PropTypes.string.isRequired,
  anchorName: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  heading: PropTypes.node,
  group: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};


FormGroupLayoutLine.displayName = 'FormGroupLayoutLine';


registerComponent('FormGroupLayoutLine', FormGroupLayoutLine, [withStyles, styles]);

