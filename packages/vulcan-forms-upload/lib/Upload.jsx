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
  return imageUrl
}

/*

Remove the nth item from an array

*/
const removeNthItem = (array, n) => [..._.first(array, n), ..._.rest(array, n+1)];

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
          <img style={{width: 150}} src={getImageUrl(this.props.image)} />
          {this.props.image.loading ? <div className="upload-loading"><Components.Loading /></div> : null}
        </div>
        <a href="javascript:void(0)" onClick={this.clearImage}><Components.Icon name="close"/> Remove image</a>
      </div>
    )
  }
}

/*

Cloudinary Image Upload component

*/
class Upload extends PureComponent {

  constructor(props, context) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.clearImage = this.clearImage.bind(this);
    this.enableMultiple = this.enableMultiple.bind(this);

    const isEmpty = !props.value || (this.enableMultiple() && props.value.length === 0);
    const emptyValue = this.enableMultiple() ? [] : '';

    this.state = {
      preview: '',
      uploading: false,
      value: isEmpty ? emptyValue : props.value,
    }

  }

  /*

  Add to autofilled values so SmartForms doesn't think the field is empty
  if the user submits the form without changing it

  */
  componentWillMount() {
    const isEmpty = !this.props.value || (this.enableMultiple() && this.props.value.length === 0);
    const emptyValue = this.enableMultiple() ? [] : '';
    this.context.addToAutofilledValues({[this.props.name]: isEmpty ? emptyValue : this.props.value});
  }

  /*

  Check the field's type to decide if the component should handle
  multiple image uploads or not

  */
  enableMultiple() {
    return this.props.datatype.definitions[0].type === Array;
  }

  /*

  When an image is uploaded

  */
  onDrop(files) {
    
    const preview = {secure_url: files[0].preview, loading: true};

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
      const imageUrl = body.eager ? body.eager : body.secure_url;
      const newValue = this.enableMultiple() ? [...this.state.value, imageUrl] : imageUrl;

      // set the uploading status to false
      this.setState({
        preview: '',
        uploading: false,
        value: newValue,
      });

      // tell vulcanForm to catch the value
      this.context.addToAutofilledValues({[this.props.name]: newValue});
    })
    .catch(err => console.log('err', err));
  }

  /*

  Remove the image at `index` (or just remove image if no index is passed)

  */
  clearImage(index) {
    const newValue = this.enableMultiple() ? removeNthItem(this.state.value, index): '';
    this.context.addToAutofilledValues({[this.props.name]: newValue});
    this.setState({
      preview: newValue,
      value: newValue,
    });
  }

  render() {
    const { uploading, preview, value } = this.state;
    // show the actual uploaded image or the preview

    const imageData = this.enableMultiple() ? (preview ? value.concat(preview) : value) : value || preview;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <div className="upload-field">
            <Dropzone ref="dropzone"
              multiple={this.enableMultiple()}
              onDrop={this.onDrop}
              accept="image/*"
              className="dropzone-base"
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject"
            >
              <div><FormattedMessage id="upload.prompt"/></div>
              {uploading ? <div className="upload-uploading"><span><FormattedMessage id="upload.uploading"/></span></div> : null}
            </Dropzone>

            {imageData ?
              <div className="upload-state">
                <div className="upload-images">
                  {this.enableMultiple() ? 
                    imageData.map((image, index) => <Image clearImage={this.clearImage} key={index} index={index} image={image}/>) : 
                    <Image clearImage={this.clearImage} image={imageData}/>
                  }
                </div>
              </div>
            : null}
          </div>
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string
};

Upload.contextTypes = {
  addToAutofilledValues: PropTypes.func,
};

registerComponent('Upload', Upload);

export default Upload;