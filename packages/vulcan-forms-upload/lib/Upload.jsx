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
      <div className={`upload-image ${this.props.loading ? 'upload-image-loading' : ''}`}>
        <div className="upload-image-contents">
          <img style={{ width: 150 }} src={getImageUrl(this.props.image)} />
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

  state = { uploading: false }

  count = this.props.value.length;

  /*

  Check the field's type to decide if the component should handle
  multiple image uploads or not.

  For multiple images, the component expects an array of images; 
  for single images it expects a single image object.

  */
  enableMultiple = () => {
    return this.props.datatype && this.props.datatype[0].type === Array;
  };

  /*

  When an image is uploaded

  */
  onDrop = files => {
    const promises = [];

    // set the component in upload mode
    this.setState({
      uploading: true,
    });

    // request url to cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${getSetting('cloudinary.cloudName')}/upload`;

    // trigger a request for each file
    files.forEach((file, index) => {

      // figure out update path for current image
      const updateIndex = this.count + index;
      const updatePath = this.enableMultiple() ? `${this.props.path}.${updateIndex}` : this.props.path;

      // build preview object
      const previewObject = { secure_url: file.preview, loading: true, preview: true };

      // update current values using preview object
      this.props.updateCurrentValues({ [updatePath]: previewObject });

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
              this.props.throwError({ id: 'upload.error', path: this.props.path, message: body.error.message });
              return null;
            } else {
              // use the https:// url given by cloudinary; or eager property if using transformations
              const imageObject = body.eager ? body.eager : body.secure_url;
              this.props.updateCurrentValues({ [updatePath]: imageObject });
              return imageObject;
            }
          })
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
            this.props.throwError({ id: 'upload.error', path: this.props.path, message: error.message });
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

  Remove the image at `index` (or just remove image if no index is passed)

  */
  clearImage = index => {
    if (this.enableMultiple()) {
      this.props.addToDeletedValues(`${this.props.path}.${index}`);
    } else {
      this.props.addToDeletedValues(this.props.path);
    }
  };

  getImages = () => {
    // show the actual uploaded image(s)
    return this.enableMultiple() ? this.props.value : [this.props.value];
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
              disabled={this.state.uploading}
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
                  {images.map(
                    (image, index) =>
                      !this.isDeleted(index) &&
                      image && (
                        <Image
                          clearImage={this.clearImage}
                          key={index}
                          index={index}
                          image={image}
                          loading={image.loading}
                          preview={image.preview}
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

registerComponent('Upload', Upload);

export default Upload;
