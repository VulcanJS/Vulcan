import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { getContrastRatio } from '@material-ui/core/styles';
import classNames from 'classnames';


const describeTypography = (theme, className) => {
  const typography = className ? theme.typography[className] : theme.typography;
  const fontFamily = typography.fontFamily.split(',')[0];
  const fontSize = `${typography.fontSize}${typeof typography.fontSize === 'number' ? 'px' : ''}`;
  return `${fontFamily} ${typography.fontWeight} ${fontSize}`;
};

function getColorBlock(theme, classes, colorName, colorValue, colorTitle) {
  const bgColor = theme.palette[colorName][colorValue] || theme.palette.common.midBlack;
  if (typeof bgColor !== 'string' || !bgColor.match(/^(#|rgb|rgba|hsl|hsla)/)) return null;

  let fgColor = theme.palette.common.black;
  if (getContrastRatio(bgColor, fgColor) < 7) {
    fgColor = theme.palette.common.white;
  }

  let blockTitle;
  if (colorTitle) {
    blockTitle = <div className={classes.name}>{colorName}</div>;
  }

  let rowStyle = {
    backgroundColor: bgColor,
    color: fgColor,
    listStyle: 'none',
    padding: 15,
  };

  return (
    <div key={colorName + colorValue}>
      {
        colorValue.toString().match(/^(A100|light|contrastText)$/) &&
        <div className={classes.blockSpace}/>
      }
      <li style={rowStyle} key={colorValue}>
        {blockTitle}
        <div className={classes.colorContainer}>
          <span>{colorValue}</span>
          <span className={classes.colorValue}>{bgColor.toUpperCase()}</span>
        </div>
      </li>
    </div>
  );
}

function getColorGroup(options) {
  const { theme, classes, color } = options;
  if (typeof theme.palette[color] !== 'object') return null;

  const cssColor = color.replace(' ', '').replace(color.charAt(0), color.charAt(0).toLowerCase());
  let colorsList = [];
  colorsList =
    Object.keys(theme.palette[cssColor]).map(mainValue => getColorBlock(theme, classes, cssColor, mainValue));

  return (
    <ul className={classes.colorGroup} key={cssColor}>
      {getColorBlock(theme, classes, cssColor, 500, true)}
      <div className={classes.blockSpace}/>
      {colorsList}
    </ul>
  );
}

const styles = theme => ({
  root: {
    '& button + button': {
      marginLeft: theme.spacing(2),
    }
  },
  paper: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  name: {
    marginBottom: 60,
  },
  blockSpace: {
    height: 4,
    backgroundColor: theme.palette.background.default,
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  colorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorGroup: {
    backgroundColor: '#888',
    padding: 0,
    margin: theme.spacing(0, 2, 2, 0),
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      flexGrow: 0,
    },
  },
  colorValue: {
    ...theme.typography.caption,
    color: 'inherit',
  },
});

const specialPalettes = ['common', 'text', 'action', 'grey'];

const latin =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur justo quam, ' +
  'pellentesque ultrices ex a, aliquet porttitor ante. Donec tellus arcu, viverra ut lorem id, ' +
  'ultrices ultricies enim. Donec enim metus, sollicitudin id lobortis id, iaculis ut arcu. ' +
  'Maecenas sollicitudin congue nisi. Donec convallis, ipsum ac ultricies dignissim, orci ex ' +
  'efficitur lectus, ac lacinia risus nunc at diam. Nam gravida bibendum lectus. Donec ' +
  'scelerisque sem nec urna vestibulum vehicula.';

const ThemeStyles = ({ theme, classes }) => {
  return (
    <Grid container className={classNames('theme-styles', classes.root)}>

      <Grid item xs={6}>
        <Typography variant="h1">h1: {describeTypography(theme, 'h1')}</Typography>
        <Typography variant="h2">h2: {describeTypography(theme, 'h2')}</Typography>
        <Typography variant="h3">h3: {describeTypography(theme, 'h3')}</Typography>
        <Typography variant="h4">h4: {describeTypography(theme, 'h4')}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Paper className={classes.paper}>

          <Grid container>

            <Grid item xs={12} lg={6}>
              <Typography variant="h5" gutterBottom>
                h5: {describeTypography(theme, 'h5')}
              </Typography>
              <Typography variant="h6" gutterBottom>
                h6: {describeTypography(theme, 'h6')}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Subtitle1: {describeTypography(theme, 'subtitle1')}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Subtitle2: {describeTypography(theme, 'subtitle2')}
              </Typography>
            </Grid>

            <Grid item xs={12} lg={6}>
              <p>
                <Button variant="contained">Default</Button>
                <Button variant="contained" color="primary">Primary</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" disabled>Disabled</Button>
              </p>

              <p>
                <Button>Default</Button>
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button disabled>Disabled</Button>
              </p>

              <p>
                <Button variant="outlined">Default</Button>
                <Button variant="outlined" color="primary">Primary</Button>
                <Button variant="outlined" color="secondary">Secondary</Button>
                <Button variant="outlined" disabled>Disabled</Button>
              </p>
            </Grid>

          </Grid>

          <Divider className={classes.divider}/>

          <Typography variant="body1" gutterBottom>
            Body 1: {describeTypography(theme, 'body1')} - {latin}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {latin}
          </Typography>

          <Divider className={classes.divider}/>

          <Typography variant="body2" gutterBottom>
            Body 2: {describeTypography(theme, 'body2')} - {latin}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {latin}
          </Typography>

          <Divider className={classes.divider}/>

          <Typography variant="button" gutterBottom>
            Button - {describeTypography(theme)}
          </Typography>

          <Divider className={classes.divider}/>

          <Typography variant="caption" gutterBottom>
            Caption: {describeTypography(theme, 'caption')}
          </Typography>

          <Divider className={classes.divider}/>

          <Typography variant="overline" gutterBottom>
            Overline: {describeTypography(theme, 'overline')}
          </Typography>

          <Divider className={classes.divider}/>

          <Typography gutterBottom>
            Base: {describeTypography(theme)} - {latin}
          </Typography>

        </Paper>
      </Grid>


      {
        Object.keys(theme.palette).map(color => {
          if (specialPalettes.includes(color)) return null;

          const colorGroup = getColorGroup({ theme, classes, color });
          if (!colorGroup) return null;

          return (
            <Grid item xs={12} sm={6} md={3} key={color}>
              {colorGroup}
            </Grid>
          );
        })
      }

      {
        Object.keys(theme.palette).map(color => {
          if (!specialPalettes.includes(color)) return null;

          const colorGroup = getColorGroup({ theme, classes, color });
          if (!colorGroup) return null;

          return (
            <Grid item xs={12} sm={6} md={3} key={color}>
              {colorGroup}
            </Grid>
          );
        })
      }

    </Grid>
  );
};

ThemeStyles.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

registerComponent('ThemeStyles', ThemeStyles, withTheme, [withStyles, styles]);
