import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, getComponent } from 'meteor/vulcan:lib';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';


/*

Material UI GUI for Cloudinary Image Upload component

*/


const styles = theme => ({
  
  root: {},
  
  label: {},
  
  uploadField: {
    marginTop: theme.spacing.unit,
  },
  
  dropzoneBase: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: theme.palette.background[900],
    backgroundColor: theme.palette.background[100],
    color: theme.palette.common.lightBlack,
    padding: '30px 60px',
    transition: 'all 0.5s',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&[aria-disabled="false"]:hover': {
      color: theme.palette.common.midBlack,
      borderColor: theme.palette.background['A200'],
    }
  },
  
  dropzoneActive: {
    borderStyle: 'solid',
    borderColor: theme.palette.status.info,
  },
  
  dropzoneReject: {
    borderStyle: 'solid',
    borderColor: theme.palette.status.danger,
  },
  
  uploadState: {},
  
  uploadImages: {
    border: `1px solid ${theme.palette.background[500]}`,
    backgroundColor: theme.palette.background[100],
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 0.5,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 0.5,
  },
});


const UploadInner = (props) => {
  const {
    uploading,
    images,
    disabled,
    maxCount,
    label,
    help,
    options,
    enableMultiple,
    onDrop,
    isDeleted,
    clearImage,
    classes
  } = props;
  
  const UploadImage = getComponent(options.uploadImageComponentName || 'UploadImage');
  
  return (
    <FormControl component="fieldset" fullWidth={true} className={classes.root}>
      
      <FormLabel component="legend" className={classes.label}>
        {label}
      </FormLabel>
      {
        help &&
        
        <FormHelperText>{help}</FormHelperText>
      }
      <div className={classes.uploadField}>
        {
          (disabled && !enableMultiple)
            ?
            null
            :
            <Dropzone
              style={options.dropzoneStyle}
              multiple={enableMultiple}
              onDrop={onDrop}
              accept="image/*"
              className={classes.dropzoneBase}
              activeClassName={classes.dropzoneActive}
              rejectClassName={classes.dropzoneReject}
              disabled={disabled}
            >
              <div>
                <FormattedMessage id={`upload.${disabled ? 'maxReached' : 'prompt'}`}
                                  values={{ maxCount }}/>
              </div>
              {uploading && (
                <div className="upload-uploading">
                  <span>
                    <FormattedMessage id={'upload.uploading'}/>
                  </span>
                </div>
              )}
            </Dropzone>
        }
        
        {!!images.length && (
          <div className={classes.uploadState}>
            <div className={classes.uploadImages}>
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
                      style={options.imageStyle}
                    />
                  )
              )}
            </div>
          </div>
        )}
      </div>
    
    </FormControl>
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
  classes: PropTypes.object.isRequired,
};


UploadInner.displayName = 'UploadInnerMui';


registerComponent('UploadInner', UploadInner, [withStyles, styles]);
