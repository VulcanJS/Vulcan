/*

This component supports uploading and storing an array of images. 

Note also that an image can be stored as a simple string, or as an array of formats
(each format being itself an object).

### Deleting Images

When clearing an image, it is addeds to `deletedValues` and set to `null` in the array,
but the array item itself is not deleted. The entire array is then cleaned when submitting the form.

*/
import {
  Components,
  getSetting,
  registerSetting,
  registerComponent,
} from 'meteor/vulcan:lib';
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import 'cross-fetch/polyfill'; // patch for browser which don't have fetch implemented
import {FormattedMessage} from 'meteor/vulcan:i18n';
import set from 'lodash/set';

registerSetting(
  'cloudinary.cloudName',
  null,
  'Cloudinary cloud name (for image uploads)'
);

/*

Dropzone styles

*/
const baseStyle = {
  borderWidth: 1,
  borderStyle: 'dashed',
  marginBottom: '10',
  padding: '10',
};
const activeStyle = {
  borderStyle: 'solid',
  borderColor: '#6c6',
  backgroundColor: '#eee',
};
const rejectStyle = {
  borderStyle: 'solid',
  borderColor: '#c66',
  backgroundColor: '#eee',
};

/*

Get a URL from an image or an array of images

*/
const getImageUrl = imageOrImageArray => {
  // if image is actually an array of formats, use first format
  const image = Array.isArray(imageOrImageArray)
    ? imageOrImageArray[0]
    : imageOrImageArray;
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
      <div
        className={`upload-image ${
          this.props.loading ? 'upload-image-loading' : ''
        } ${this.props.error ? 'upload-image-error' : ''}`}>
        <div className="upload-image-contents">
          <img style={{width: 150}} src={getImageUrl(this.props.image)} />
          {this.props.loading && (
            <div className="upload-loading">
              <Components.Loading />
            </div>
          )}
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

    const self = this;

    // add callback to clean any preview or error values
    // (when handling multiple images)
    function uploadKeepRealImages(data) {
      if (Array.isArray(self.props.value)) {
        // keep only "real" images
        const images = self.getImages({
          includePreviews: false,
          includeDeleted: false,
        });
        // replace images in `data` object with real images
        set(data, self.props.path, images);
      }
      return data;
    }
    context.addToSubmitForm(uploadKeepRealImages);
  }
  state = {uploading: false};

  /*

  Find out field type

  */
  getFieldType = () => {
    return this.props.datatype && this.props.datatype[0].type;
  }
  
  /*

  Check the field's type to decide if the component should handle
  multiple image uploads or not. Default to yes.

  */
  enableMultiple = () => {
    return this.getFieldType() !== String || this.props.maxCount !== 1;
  };

  /*

  Whether to disable the dropzone. 

  */
  isDisabled = () => {
    return (
      this.state.uploading ||
      this.props.maxCount <= this.getImages({includeDeleted: false}).length
    );
  };

  /*

  When an image is uploaded

  */
  onDrop = files => {
    const promises = [];
    const imagesCount = this.getImages().length;

    this.props.clearFieldErrors(this.props.path);

    // set the component in upload mode
    this.setState({
      uploading: true,
    });

    // request url to cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${getSetting(
      'cloudinary.cloudName'
    )}/upload`;

    // trigger a request for each file
    files.forEach((file, index) => {
      // figure out update path for current image
      const updateIndex = imagesCount + index;
      const updatePath = this.getFieldType() === String ? this.props.path : `${this.props.path}.${updateIndex}`;

      // build preview object
      const previewObject = {
        secure_url: file.preview,
        loading: true,
        preview: true,
      };

      // update current values using preview object
      this.props.updateCurrentValues({[updatePath]: previewObject});

      // request body
      const body = new FormData();
      body.append('file', file);
      body.append('upload_preset', this.props.options.preset);

      // post request to cloudinary
      promises.push(
        fetch(cloudinaryUrl, {
          method: 'POST',
          body,
        })
          .then(res => res.json()) // json-ify the readable strem
          .then(body => {
            if (body.error) {
              // eslint-disable-next-line no-console
              console.log(body.error);
              this.props.throwError({
                id: 'upload.error',
                path: this.props.path,
                message: body.error.message,
              });
              const errorObject = {
                ...previewObject,
                loading: false,
                error: true,
              };
              this.props.updateCurrentValues({[updatePath]: errorObject});
              return null;
            } else {
              // use the https:// url given by cloudinary; or eager property if using transformations
              const imageObject = body.eager ? body.eager : body.secure_url;
              this.props.updateCurrentValues({[updatePath]: imageObject});
              return imageObject;
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
            this.props.throwError({
              id: 'upload.error',
              path: this.props.path,
              message: error.message,
            });
          })
      );
    });

    Promise.all(promises).then(values => {
      // console.log(values);
      // set the uploading status to false
      this.setState({
        uploading: false,
      });
    });
  };

  isDeleted = index => {
    return this.props.deletedValues.includes(`${this.props.path}.${index}`);
  };

  /*

  Remove the image at `index`

  */
  clearImage = index => {
    this.props.updateCurrentValues({[`${this.props.path}.${index}`]: null});
  };

  /*

  Get images, with or without previews/deleted images

  */
  getImages = (args = {}) => {
    const {includePreviews = true, includeDeleted = false} = args;
    let images = this.props.value;

    // if images is an empty string, null, etc. just return an empty array
    if (!images) {
      return [];
    }

    // if images is not array, make it one (for backwards compatibility)
    if (!Array.isArray(images)) {
      images = [images];
    }
    // remove previews if needed
    images = includePreviews ? images : images.filter(image => !image.preview);
    // remove deleted images
    images = includeDeleted
      ? images
      : images.filter((image, index) => !this.isDeleted(index));
    return images;
  };

  render() {
    const {uploading} = this.state;
    const images = this.getImages({includeDeleted: true});

    return (
      <div
        className={`form-group row ${
          this.isDisabled() ? 'upload-disabled' : ''
        }`}>
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <div className="upload-field">
            <Dropzone
              multiple={this.enableMultiple()}
              onDrop={this.onDrop}
              accept="image/*"
              className="dropzone-base"
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject"
              disabled={this.isDisabled()}>
              {({getRootProps, getInputProps, isDragActive, isDragReject}) => {
                let styles = {...baseStyle};
                styles = isDragActive ? {...styles, ...activeStyle} : styles;
                styles = isDragReject ? {...styles, ...rejectStyle} : styles;
                return (
                  <div {...getRootProps()} style={styles}>
                    <input {...getInputProps()} />
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
                  </div>
                );
              }}
            </Dropzone>

            {!!images.length && (
              <div className="upload-state">
                <div className="upload-images">
                  {images.map(
                    (image, index) =>
                      !this.isDeleted(index) && (
                        <Image
                          clearImage={this.clearImage}
                          key={index}
                          index={index}
                          image={image}
                          loading={image.loading}
                          preview={image.preview}
                          error={image.error}
                        />
                      )
                  )}
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
  addToSubmitForm: PropTypes.func,
};

registerComponent('Upload', Upload);

export default Upload;
