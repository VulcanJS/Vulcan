/*

This component supports uploading and storing an array of images. 

Note also that an image can be stored as a simple string, or as an array of formats
(each format being itself an object).

### Deleting Images

When clearing an image, it is addeds to `deletedValues` and set to `null` in the array,
but the array item itself is not deleted. The entire array is then cleaned when submitting the form.

*/
import { Components, getSetting, registerSetting, registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import 'cross-fetch/polyfill'; // patch for browser which don't have fetch implemented
import set from 'lodash/set';

registerSetting('cloudinary.cloudName', null, 'Cloudinary cloud name (for image uploads)');

/*

Cloudinary Image Upload component

*/
class Upload extends PureComponent {

  constructor(props, context) {
    super(props);
  
    this.onDrop = this.onDrop.bind(this);
    
    this.arrayField = props.datatype[0].type === Array;
    this.maxCount = typeof this.props.maxCount === 'number' ?
        this.props.maxCount :
        this.arrayField ?
          1000 :
          1;
    this.enableMultiple = this.maxCount !== 1;
      
    // add callback to clean any preview or error values
    context.addToSubmitForm(data => {
      // keep only "real" images
      const images = this.getImages({ includePreviews: false, includeDeleted: false});
      // replace images in `data` object with real images
      set(data, this.props.path, images);
      return data;
    });

  }
  state = { uploading: false };

  /*

  Whether to disable the dropzone. 

  */
  isDisabled = () => {
    return this.state.uploading || this.maxCount <= this.getImages({ includeDeleted: false }).length;
  };
  
  /*
  
  Return path to an image by index (when maxCount is 1, index is always 0)
  
  */
  getImagePath = index => {
    return this.arrayField ? `${this.props.path}.${index}` : this.props.path;
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
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${getSetting('cloudinary.cloudName')}/upload`;

    // trigger a request for each file
    files.forEach((file, index) => {
      // figure out update path for current image
      const updateIndex = imagesCount + index;
      const updatePath = this.getImagePath(updateIndex);

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
              const errorObject = { ...previewObject, loading: false, error: true };
              this.props.updateCurrentValues({ [updatePath]: errorObject });
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
    return this.props.deletedValues.includes(this.getImagePath(index));
  };

  /*

  Remove the image at `index`

  */
  clearImage = index => {
    const path = this.getImagePath(index);
    
    this.props.updateCurrentValues({ [path]: null });
  };

  /*

  Get images, with or without previews/deleted images

  */
  getImages = (args = {}) => {
    const { includePreviews = true, includeDeleted = false } = args;
    let images = this.props.value;
  
    // if images is not array, make it one (for backwards compatibility)
    if (!Array.isArray(images)) {
      images = images ? [images] : [];
    }
    // remove previews if needed
    images = includePreviews ? images : images.filter(image => !image.preview);
    // remove deleted images
    images = includeDeleted ? images : images.filter((image, index) => !this.isDeleted(index));
    return images;
  };

  render() {
    return (
      <Components.UploadInner
        uploading={this.state.uploading}
        images={this.getImages({ includeDeleted: true })}
        disabled={this.isDisabled()}
        maxCount={this.maxCount}
        label={this.props.label}
        help={this.props.help}
        options={this.props.options}
        enableMultiple={this.enableMultiple}
        onDrop={this.onDrop}
        isDeleted={this.isDeleted}
        clearImage={this.clearImage}
      />
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

Upload.displayName = "Upload";

registerComponent('Upload', Upload);

export default Upload;
