import React from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import classNames from 'classnames';


const styles = theme => ({
  
  layoutRoot: {
    minWidth: '320px'
  },
  
  headerRoot: {},
  
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


const FormGroupHeader = ({ toggle, collapsed, label, group, classes }) => {
  const collapsible = group && group.collapsible || group && group.name === 'admin';
  
  return (
    <div className={classNames(classes.headerRoot, collapsible && classes.collapsible, 'form-group-header')}
         onClick={collapsible ? toggle : null}
    >
      
      <Typography
        className={classNames('form-group-header-title', classes.subtitle1, collapsible && classes.collapsible)}
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


FormGroupHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};


replaceComponent('FormGroupHeader', FormGroupHeader, [withStyles, styles]);


const FormGroupLayout = ({ label, anchorName, collapsed, hasErrors, heading, group, children, classes }) => {
  
  return (
    <div className={classNames(classes.layoutRoot, 'form-section', `form-section-${anchorName}`)}>
      
      <a name={anchorName}/>
      
      {heading}
      
      <Collapse classes={{ container: classes.container, entered: classes.entered }} in={!collapsed || hasErrors}>
        <Paper className={classes.paper}>
          
          {children}
          
        </Paper>
      </Collapse>
    </div>
  );
};


FormGroupLayout.propTypes = {
  label: PropTypes.string.isRequired,
  anchorName: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  heading: PropTypes.node,
  group: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};


replaceComponent('FormGroupLayout', FormGroupLayout, [withStyles, styles]);

