/*

This component supports either uploading and storing a single image, or
an array of images. 

Note also that an image can be stored as a simple string, or as an array of formats
(each format being itself an object).

*/
import { Components, getSetting, registerSetting, registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import 'cross-fetch/polyfill'; // patch for browser which don't have fetch implemented
import { FormattedMessage } from 'meteor/vulcan:i18n';

registerSetting('cloudinary.cloudName', null, 'Cloudinary cloud name (for image uploads)');

/*

Get a URL from an image or an array of images

*/
const getImageUrl = imageOrImageArray => {
  // if image is actually an array of formats, use first format
  const image = Array.isArray(imageOrImageArray) ? imageOrImageArray[0] : imageOrImageArray;
  // if image is an object, return secure_url; else return image itself
  const imageUrl = typeof image === 'string' ? image : image.secure_url;
  return imageUrl;
};

/*

Display a single image

*/
class Image extends PureComponent {
  constructor() {
    super();
    this.clearImage = this.clearImage.bind(this);
  }

  clearImage(e) {
    e.preventDefault();
    this.props.clearImage(this.props.index);
  }

  render() {
    return (
      <div className="upload-image">
        <div className="upload-image-contents">
          <img style={{ width: 150 }} src={getImageUrl(this.props.image)} />
          {this.props.image.loading ? (
            <div className="upload-loading">
              <Components.Loading />
            </div>
          ) : null}
        </div>
        <a href="javascript:void(0)" onClick={this.clearImage}>
          <Components.Icon name="close" /> Remove image
        </a>
      </div>
    );
  }
}

/*

Cloudinary Image Upload component

*/
class Upload extends PureComponent {
  constructor(props, context) {
    super(props);

    this.state = {
      preview: '',
      uploading: false,
    };
  }

  /*

  Check the field's type to decide if the component should handle
  multiple image uploads or not

  */
  enableMultiple = () => {
    return this.props.datatype && this.props.datatype[0].type === Array;
  };

  /*

  When an image is uploaded

  */
  onDrop = files => {
    const preview = { secure_url: files[0].preview, loading: true };

    // set the component in upload mode with the preview
    this.setState({
      preview: this.enableMultiple() ? [...this.state.preview, preview] : preview,
      uploading: true,
    });

    // request url to cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${getSetting('cloudinary.cloudName')}/upload`;

    // request body
    const body = new FormData();
    body.append('file', files[0]);
    body.append('upload_preset', this.props.options.preset);

    // post request to cloudinary
    fetch(cloudinaryUrl, {
      method: 'POST',
      body,
    })
      .then(res => res.json()) // json-ify the readable strem
      .then(body => {
        // use the https:// url given by cloudinary; or eager property if using transformations
        const imageObject = body.eager ? body.eager : body.secure_url;

        // set the uploading status to false
        this.setState({
          preview: '',
          uploading: false,
        });

        const updateObject = this.enableMultiple() ? { [`${this.props.path}.${this.getImages().length}`]: imageObject } : { [this.props.path]: imageObject};
        
        // tell vulcanForm to catch the value
        this.context.updateCurrentValues(updateObject);
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log('err', err));
  };
  
  isDeleted = index => {
    return this.context.deletedValues.includes(`${this.props.path}.${index}`);
  };

  /*

  Remove the image at `index` (or just remove image if no index is passed)

  */
  clearImage = index => {
    if (this.enableMultiple()) {
      this.context.addToDeletedValues(`${this.props.path}.${index}`);
    } else {
      this.context.addToDeletedValues(this.props.path);
    }
  };

  getImages = () => {
    const { preview } = this.state;
    const { value } = this.props;
    // show the actual uploaded image(s) and/or the preview
    if (this.enableMultiple()) {
      return preview ? [...value, preview] : value;
    } else {
      return preview ? [preview] : [value];
    }
  };

  render() {
    const { uploading } = this.state;
    const images = this.getImages();

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <div className="upload-field">
            <Dropzone
              ref="dropzone"
              multiple={this.enableMultiple()}
              onDrop={this.onDrop}
              accept="image/*"
              className="dropzone-base"
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject"
            >
              <div>
                <FormattedMessage id="upload.prompt" />
              </div>
              {uploading && (
                <div className="upload-uploading">
                  <span>
                    <FormattedMessage id="upload.uploading" />
                  </span>
                </div>
              )}
            </Dropzone>

            {!!images.length && (
              <div className="upload-state">
                <div className="upload-images">
                  {images.map((image, index) => (
                    !this.isDeleted(index) && image && <Image clearImage={this.clearImage} key={index} index={index} image={image} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string,
};

Upload.contextTypes = {
  updateCurrentValues: PropTypes.func,
  addToDeletedValues: PropTypes.func,
  deletedValues: PropTypes.array,
};

registerComponent('Upload', Upload);

export default Upload;
