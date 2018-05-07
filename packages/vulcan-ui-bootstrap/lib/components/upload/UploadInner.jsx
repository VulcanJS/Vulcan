import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, getComponent } from 'meteor/vulcan:lib';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'meteor/vulcan:i18n';


/*

Bootstrap UI for Cloudinary Image Upload component

*/
const UploadInner = (props) => {
  const {
    uploading,
    images,
    disabled,
    label,
    options,
    enableMultiple,
    onDrop,
    isDeleted,
    clearImage,
  } = props;
  
  const UploadImage = getComponent(options.uploadImageComponentName || 'UploadImage');
  
  return (
    <div className={`form-group row ${disabled ? 'upload-disabled' : ''}`}>
      <label className="control-label col-sm-3">{label}</label>
      <div className="col-sm-9">
        <div className="upload-field">
          <Dropzone
            //ref="dropzone"
            multiple={enableMultiple}
            onDrop={onDrop}
            accept="image/*"
            className="dropzone-base"
            activeClassName="dropzone-active"
            rejectClassName="dropzone-reject"
            disabled={disabled}
          >
            <div>
              <div>
                <FormattedMessage id={`upload.${disabled ? 'maxReached' : 'prompt'}`}
                                  values={{ maxCount }}/>
              </div>
            </div>
            {uploading && (
              <div className="upload-uploading">
                  <span>
                    <FormattedMessage id="upload.uploading"/>
                  </span>
              </div>
            )}
          </Dropzone>
          
          {!!images.length && (
            <div className="upload-state">
              <div className="upload-images">
                {images.map(
                  (image, index) =>
                    !isDeleted(index) && (
                      <UploadImage
                        clearImage={clearImage}
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
};

UploadInner.propTypes = {
  uploading: PropTypes.bool,
  images: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  maxCount: PropTypes.number.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  options: PropTypes.object.isRequired,
  enableMultiple: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  isDeleted: PropTypes.func.isRequired,
  clearImage: PropTypes.func.isRequired,
};

UploadInner.displayName = "UploadInnerBootstrap";

registerComponent('UploadInner', UploadInner);
