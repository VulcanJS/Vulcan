import React, { Component } from 'react';
import {registerComponent} from 'meteor/vulcan:core';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import { Image } from 'cloudinary-react';

class ImageUpload extends Component {
  constructor(props, context) {
    super(props, context);
    const fieldName = props.name;
    let imageId = "";
    if (props.document && props.document[fieldName]) {
      imageId = props.document[fieldName];
    }
    this.state = {
      imageId,
    }
    const addValues = context.addToAutofilledValues;
    const addToSuccessForm = context.addToSuccessForm;
    console.log("ImageUpload added initial value");
    addValues({[fieldName]: imageId});
    addToSuccessForm((results) => this.setImageInfo({} ,""));
  }

  setImageInfo = (error, imageInfo) => {
    console.log(imageInfo);
    if (imageInfo && imageInfo[0] && imageInfo[0].public_id ) {
      this.setState({imageId: imageInfo[0].public_id});
      const addValues = this.context.addToAutofilledValues;
      const fieldName = this.props.name;
      addValues({[fieldName]: imageInfo[0].public_id})
    } else {
      console.log("Image Upload failed");
    }
  }

  uploadWidget = () => {
    let min_image_height, min_image_width, cropping_aspect_ratio, cropping_default_selection_ratio, upload_preset;
    if (this.props.name == "gridImageId") {
      min_image_height = 80;
      min_image_width = 203;
      cropping_aspect_ratio = 2.5375;
      upload_preset = 'tz0mgw2s';
    } else if (this.props.name == "bannerImageId") {
      min_image_height = 380;
      min_image_width = 1600;
      cropping_default_selection_ratio = 3;
      upload_preset = 'navcjwf7';
    }
    cloudinary.openUploadWidget({cropping: "server", cloud_name: 'lesswrong-2-0', upload_preset, theme: 'minimal', min_image_height, min_image_width, cropping_validate_dimension: true, cropping_show_dimensions: true, cropping_default_selection_ratio, cropping_aspect_ratio}, this.setImageInfo);
  }
  render(){
    return (
      <div className="upload">
        <Helmet>
          <script src="https://widget.cloudinary.com/global/all.js" type="text/javascript"/>
          <script src='//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'/>
        </Helmet>
        <div className="image-upload-description">{this.props.name}</div>
        {this.state.imageId ? <Image publicId={this.state.imageId} cloudName="lesswrong-2-0" quality="auto" sizes="100vw" responsive={true} width={this.props.name == "gridImageId" ? "203" : "auto"} height={this.props.name == "bannerImageId" ? "380" : "80"} dpr="auto" crop="fill" gravity="custom" /> : null}
        <FlatButton label={this.state.imageId ? "Replace Image" : "Upload Image"} onClick={this.uploadWidget} className="image-upload-button" />
      </div>
    );
  }
}

ImageUpload.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  addToSuccessForm: React.PropTypes.func,
};

registerComponent("ImageUpload", ImageUpload);

export default ImageUpload
