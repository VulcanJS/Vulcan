import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from 'mdi-material-ui/ChevronUp';
import ExpandMoreIcon from 'mdi-material-ui/ChevronDown';
import classNames from 'classnames';

const styles = theme => ({
  layoutRoot: {
    minWidth: '320px',
  },

  headerRoot: {
    marginTop: theme.spacing(3),
  },

  divider: {
    marginLeft: theme.spacing(-3),
    marginRight: theme.spacing(-3),
  },

  collapsible: {
    cursor: 'pointer',
  },

  label: {},

  subtitle1: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
    '& > div:first-child': {
      ...theme.typography.subtitle1,
    },
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },

  toggle: {
    color: theme.palette.action.active,
  },

  entered: {
    overflow: 'visible',
  },
});

const FormGroupHeaderLine = ({ toggle, collapsed, label, group, classes }) => {
  const collapsible = (group && group.collapsible) || (group && group.name === 'admin');

  return (
    <div
      className={classNames(
        classes.headerRoot,
        collapsible && classes.collapsible,
        'form-group-header'
      )}
      onClick={collapsible ? toggle : null}>
      <Divider className={classes.divider} />

      <Typography
        className={classNames(
          'form-group-header-title',
          classes.subtitle1,
          collapsible && classes.collapsible
        )}
        variant="subtitle1"
        gutterBottom>
        <div className={classes.label}>{label}</div>
        {collapsible && (
          <div className={classes.toggle}>
            {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </div>
        )}
      </Typography>
    </div>
  );
};

FormGroupHeaderLine.propTypes = {
  toggle: PropTypes.func,
  collapsed: PropTypes.bool,
  label: PropTypes.string.isRequired,
  group: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

FormGroupHeaderLine.displayName = 'FormGroupHeaderLine';

registerComponent('FormGroupHeaderLine', FormGroupHeaderLine, [withStyles, styles]);

const FormGroupLayoutLine = ({
  label,
  anchorName,
  collapsed,
  hidden,
  hasErrors,
  heading,
  group,
  children,
  classes,
}) => {
  const collapsedIn = (!collapsed && !hidden) || hasErrors;

  return (
    <div className={classNames(classes.layoutRoot, 'form-section', `form-section-${anchorName}`)}>
      <a name={anchorName} />

      {heading}

      <Collapse classes={{ entered: classes.entered }} in={collapsedIn}>
        {children}
      </Collapse>
    </div>
  );
};

FormGroupLayoutLine.propTypes = {
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

FormGroupLayoutLine.displayName = 'FormGroupLayoutLine';

registerComponent('FormGroupLayoutLine', FormGroupLayoutLine, [withStyles, styles]);
