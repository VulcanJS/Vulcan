import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from 'mdi-material-ui/Delete';
import classNames from 'classnames';

/**
 * Used by UploadInner to display a single image
 */
const styles = theme => ({
  uploadImage: {
    textAlign: 'center',
    marginBottom: theme.spacing(-1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },

  uploadImageContents: {
    position: 'relative',
  },

  uploadImageImg: {
    display: 'block',
    maxWidth: 150,
    maxHeight: 150,
  },

  uploadLoading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    span: {
      display: 'block',
      fontSize: '1.5rem',
    },
  },

  deleteButton: {},
});

class UploadImage extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClear = this.handleClear.bind(this);
  }

  handleClear(event) {
    event.preventDefault();
    this.props.clearImage(this.props.index);
  }

  // Get the URL of an image or the first in an array of images
  getImageUrl(imageOrImageArray) {
    // if image is actually an array of formats, use first format
    const image = Array.isArray(imageOrImageArray) ? imageOrImageArray[0] : imageOrImageArray;

    // if image is an object, return secure_url; else return image itself
    return typeof image === 'string' ? image : image.secure_url;
  }

  render() {
    const { loading, error, image, style, classes } = this.props;

    return (
      <div className={classes.uploadImage}>
        <div className={classes.uploadImageContents}>
          <img className={classes.uploadImageImg} src={this.getImageUrl(image)} style={style} />
          {loading && (
            <div className={classes.uploadLoading}>
              <Components.Loading />
            </div>
          )}
        </div>

        <IconButton className={classes.deleteButton} onClick={this.handleClear}>
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
}

UploadImage.propTypes = {
  clearImage: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

UploadImage.displayName = 'UploadImageMui';

registerComponent('UploadImage', UploadImage, [withStyles, styles]);
