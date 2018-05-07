import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:lib';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import classNames from 'classnames';

/**
 * Display a single image
 */
class UploadImage extends PureComponent {
  
  constructor (props) {
    super(props);
    this.handleClear = this.handleClear.bind(this);
  }
  
  handleClear (event) {
    event.preventDefault();
    this.props.clearImage(this.props.index);
  }
  
  /**
   * Get a URL from an image or an array of images
   */
  getImageUrl (imageOrImageArray) {
    // if image is actually an array of formats, use first format
    const image = Array.isArray(imageOrImageArray) ? imageOrImageArray[0] : imageOrImageArray;
    
    // if image is an object, return secure_url; else return image itself
    return typeof image === 'string' ? image : image.secure_url;
  }
  
  render () {
    const { loading, error, image } = this.props;
    
    const className = classNames('upload-image', 
      loading && 'upload-image-loading', 
      error && 'upload-image-error');
    
    return (
      <div className={className}>
        <div className="upload-image-contents">
          <img style={{ width: 150 }} src={this.getImageUrl(image)}/>
          {loading && (
            <div className="upload-loading">
              <Components.Loading/>
            </div>
          )}
        </div>
        <a href="javascript:void(0)" onClick={this.handleClear}>
          <Components.Icon name="close"/> <FormattedMessage id="upload.remove"/>
        </a>
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
};

UploadImage.displayName = "UploadImageBootstrap";

registerComponent('UploadImage', UploadImage);
