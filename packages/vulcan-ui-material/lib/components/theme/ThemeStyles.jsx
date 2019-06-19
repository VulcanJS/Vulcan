import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import withTheme from '@material-ui/core/styles/withTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';


const describeTypography = (theme, className) => {
  const typography = className ? theme.typography[className] : theme.typography;
  const fontFamily = typography.fontFamily.split(',')[0];
  return `${fontFamily} ${typography.fontWeight} ${typography.fontSize}px`;
};


const mainPalette = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const altPalette = ['A100', 'A200', 'A400', 'A700'];


function getColorBlock(theme, classes, colorName, colorValue, colorTitle) {
  const bgColor = theme.palette[colorName][colorValue];
  
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
  
  if (colorValue.toString().indexOf('A1') === 0) {
    rowStyle = {
      ...rowStyle,
      marginTop: 4,
    };
  }
  
  return (
    <li style={rowStyle} key={colorValue}>
      {blockTitle}
      <div className={classes.colorContainer}>
        <span>{colorValue}</span>
        <span className={classes.colorValue}>{bgColor.toUpperCase()}</span>
      </div>
    </li>
  );
}

function getColorGroup(options) {
  const { theme, classes, color, showAltPalette } = options;
  const cssColor = color.replace(' ', '').replace(color.charAt(0), color.charAt(0).toLowerCase());
  let colorsList = [];
  colorsList = mainPalette.map(mainValue => getColorBlock(theme, classes, cssColor, mainValue));
  
  if (showAltPalette) {
    altPalette.forEach(altValue => {
      colorsList.push(getColorBlock(theme, classes, cssColor, altValue));
    });
  }
  
  return (
    <ul className={classes.colorGroup} key={cssColor}>
      {getColorBlock(theme, classes, cssColor, 500, true)}
      <div className={classes.blockSpace} />
      {colorsList}
    </ul>
  );
}


const styles = theme => ({
  root: {},
  paper: {
    padding: theme.spacing.unit * 3,
  },
  name: {
    marginBottom: 60,
  },
  blockSpace: {
    height: 4,
  },
  colorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorGroup: {
    padding: '16px 0',
    margin: '0 15px 0 0',
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


const latin = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur justo quam, ' +
  'pellentesque ultrices ex a, aliquet porttitor ante. Donec tellus arcu, viverra ut lorem id, ' +
  'ultrices ultricies enim. Donec enim metus, sollicitudin id lobortis id, iaculis ut arcu. ' +
  'Maecenas sollicitudin congue nisi. Donec convallis, ipsum ac ultricies dignissim, orci ex ' +
  'efficitur lectus, ac lacinia risus nunc at diam. Nam gravida bibendum lectus. Donec ' +
  'scelerisque sem nec urna vestibulum vehicula.';


const ThemeStyles = ({ theme, classes }) => {
  return (
    <Grid container className={classNames('theme-styles', classes.root)}>
      
      <Grid item xs={12}>
        <Typography variant="h1">
          h1: {describeTypography(theme, 'h1')}
        </Typography>
        <Typography variant="h2">
          h2: {describeTypography(theme, 'h2')}
        </Typography>
        <Typography variant="h3">
          h3: {describeTypography(theme, 'h3')}
        </Typography>
        <Typography variant="h4">
          h4: {describeTypography(theme, 'h4')}
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            h5: {describeTypography(theme, 'h5')}
          </Typography>
          <Typography variant="h6" gutterBottom>
            h6: {describeTypography(theme, 'h6')}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Subtitle1: {describeTypography(theme, 'subtitle1')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Body 1: {describeTypography(theme, 'body1')} - {latin}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {latin}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Body 2: {describeTypography(theme, 'body2')} - {latin}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {latin}
          </Typography>
          <Typography variant="caption" gutterBottom align="center">
            Caption: {describeTypography(theme, 'caption')}
          </Typography>
          <Typography gutterBottom>
            Base: {describeTypography(theme)} - {latin}
          </Typography>
          <Typography variant="button" gutterBottom align="center">
            Button - {describeTypography(theme)}
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        {
          getColorGroup({
            theme,
            classes,
            color: 'primary',
            showAltPalette: true,
          })
        }
      </Grid>
  
      <Grid item xs={12} sm={6} md={3}>
        {
          getColorGroup({
            theme,
            classes,
            color: 'secondary',
            showAltPalette: true,
          })
        }
      </Grid>
  
      <Grid item xs={12} sm={6} md={3}>
        {
          getColorGroup({
            theme,
            classes,
            color: 'error',
            showAltPalette: true,
          })
        }
      </Grid>
  
      <Grid item xs={12} sm={6} md={3}>
        {
          getColorGroup({
            theme,
            classes,
            color: 'background',
            showAltPalette: true,
          })
        }
      </Grid>

    </Grid>
  );
};


ThemeStyles.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};


registerComponent('ThemeStyles', ThemeStyles, [withTheme, null], [withStyles, styles]);
