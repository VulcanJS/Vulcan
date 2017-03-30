import { Components, getSetting, registerComponent } from 'meteor/vulcan:lib';
import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import 'isomorphic-fetch'; // patch for browser which don't have fetch implemented

class Upload extends Component {

  constructor(props) {
    super(props);

    this.onDrop = this.onDrop.bind(this);
    this.clearImage = this.clearImage.bind(this);

    this.state = {
      preview: '',
      uploading: false,
      value: props.value || '',
    }
  }

  componentWillMount() {
    this.context.addToAutofilledValues({[this.props.name]: this.props.value || ''});
  }

  onDrop(files) {
    console.log(this)
    
    // set the component in upload mode with the preview
    this.setState({
      preview: files[0].preview,
      uploading: true,
      value: '',
    });

    // request url to cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${getSetting("cloudinaryCloudName")}/upload`;

    // request body
    const body = new FormData();
    body.append("file", files[0]);
    body.append("upload_preset", this.props.options.preset);

    // post request to cloudinary
    fetch(cloudinaryUrl, {
      method: "POST",
      body,
    })
    .then(res => res.json()) // json-ify the readable strem
    .then(body => {
      // use the https:// url given by cloudinary
      const avatarUrl = body.secure_url;

      // set the uploading status to false
      this.setState({
        preview: '',
        uploading: false,
        value: avatarUrl,
      });

      // tell vulcanForm to catch the value
      this.context.addToAutofilledValues({[this.props.name]: avatarUrl});
    })
    .catch(err => console.log("err", err));
  }

  clearImage(e) {
    e.preventDefault();
    this.context.addToAutofilledValues({[this.props.name]: ''});
    this.setState({
      preview: '',
      value: '',
    });
  }

  render() {

    const { uploading, preview, value } = this.state;
    // show the actual uploaded image or the preview
    const image = preview || value;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <div className="upload-field">
            <Dropzone ref="dropzone"
              multiple={false}
              onDrop={this.onDrop}
              accept="image/*"
              className="dropzone-base"
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject"
            >
              <div>Drop an image here, or click to select an image to upload.</div>
            </Dropzone>

            {image ?
              <div className="upload-state">
                {uploading ? <span>Uploading... Preview:</span> : null}
                {value ? <a onClick={this.clearImage}><Components.Icon name="close"/> Remove image</a> : null}
                <img style={{height: 120}} src={image} />
              </div>
            : null}
          </div>
        </div>
      </div>
    );
  }
}

Upload.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
};

Upload.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('Upload', Upload);

export default Upload;