import { Components, registerComponent, Utils, getSetting } from 'meteor/vulcan:core';
import { withMutation } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'meteor/vulcan:i18n';
import FRC from 'formsy-react-components';

const Input = FRC.Input;

class EmbedURL extends Component {

  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.editThumbnail = this.editThumbnail.bind(this);
    this.clearThumbnail = this.clearThumbnail.bind(this);

    this.state = {
      loading: false,
      value: props.value || '',
      thumbnailUrl: props.document.thumbnailUrl || ''
    };
  }
  
  // clean the media property of the document if it exists: this field is handled server-side in an async callback
  async componentDidMount() {
    try {
      if (this.props.document && !_.isEmpty(this.props.document.media)) {
        await this.context.updateCurrentValues({media: {}});
      }
    } catch(error) {
      console.error('Error cleaning "media" property', error); // eslint-disable-line
    }
  }

  editThumbnail() {
    const newThumbnailUrl = prompt(this.context.intl.formatMessage({id: 'posts.enter_thumbnail_url'}), this.state.thumbnailUrl);
    if (newThumbnailUrl) {
      this.setState({thumbnailUrl: newThumbnailUrl});
      // this.context.updateCurrentValues({thumbnailUrl: newThumbnailUrl});
    }
  }

  clearThumbnail() {
    if (confirm(this.context.intl.formatMessage({id: 'posts.clear_thumbnail?'}))) {
      this.setState({thumbnailUrl: ''});
      this.context.addToDeletedValues('thumbnailUrl');
      // this.context.updateCurrentValues({thumbnailUrl: ''});
    }
  }

  // called whenever the URL input field loses focus
  async handleBlur() {
    try {
      // value from formsy input ref
      const url = this.input.getValue();
      
      // start the mutation only if the input has a value
      if (url.length) {

        // notify the user that something happens
        this.setState({loading: true});

        // the URL has changed, get new title, body, thumbnail & media for this url
        const result = await this.props.getEmbedData({url});
        
        // uncomment for debug
        // console.log('Embedly Data', result);
        
        // extract the relevant data, for easier consumption
        const { data: { getEmbedData: { title, description, thumbnailUrl } } } = result;
        const body = description;
        
        // update the form
        if (title && !this.context.getDocument().title) {
          this.context.updateCurrentValues({title});
        }
        if (body && !this.context.getDocument().body) {
          this.context.updateCurrentValues({body});
        }
        if (thumbnailUrl && !this.context.getDocument().thumbnailUrl) {
          this.setState({thumbnailUrl: thumbnailUrl});
        }

        // embedly component is done
        this.setState({loading: false});
        
        // remove errors & keep the current values 
        this.context.clearForm({clearErrors: true}); 
      }
    } catch(error) {
      
      console.error(error); // eslint-disable-line
      const errorMessage = error.message.includes('401') ? Utils.encodeIntlError({id: "app.embedly_not_authorized"}) : error.message; 
      
      // embedly component is done
      this.setState({loading: false});
      
      // something bad happened
      this.context.throwError(errorMessage);
    }
  }

  getDimensions() {
    const width = getSetting('thumbnailWidth', 80);
    const height = getSetting('thumbnailHeight', 60);
    const ratio = width/height;
    return {
      width,
      height,
      ratio
    }
  }

  renderThumbnail() {
    return (
      <div className="embedly-thumbnail">
        <img className="embedly-thumbnail-image" src={this.state.thumbnailUrl} />
        <div className="embedly-thumbnail-actions">
          <a className="thumbnail-edit" onClick={this.editThumbnail}><Components.Icon name="edit"/> <FormattedMessage id="posts.enter_thumbnail_url"/></a>
          <a className="thumbnail-clear" onClick={this.clearThumbnail}><Components.Icon name="delete"/> <FormattedMessage id="posts.clear_thumbnail"/></a>
        </div>
      </div>
    )
  }

  renderNoThumbnail() {
    return (
      <div className="embedly-thumbnail">
        <div style={{width: `${Math.round(60 * this.getDimensions().ratio)}px`, height: `60px`}} onClick={this.editThumbnail} className="embedly-thumbnail-placeholder">
          <Components.Icon name="image" />
          <FormattedMessage id="posts.enter_thumbnail_url"/>
        </div>
      </div>
    )
  }

  render() {

    const wrapperStyle = {
      position: "relative"
    };

    const loadingStyle = {
      position: "absolute",
      pointerEvents: "none",
      top: "15px",
      right: "15px"
    };

    loadingStyle.display = this.state.loading ? "block" : "none";

    // see https://facebook.github.io/react/warnings/unknown-prop.html
    const {document, control, getEmbedData, refFunction, ...rest} = this.props; // eslint-disable-line

    return (
      <div className="form-group row embedly-form-group" style={wrapperStyle}>
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9 embedly-form-control">
          <div className="embedly-url-field">
            <Input
              {...rest}
              onBlur={this.handleBlur}
              type="url"
              ref={ref => this.input = ref}
              layout="elementOnly"
            />
            <div className="embedly-url-field-loading" style={loadingStyle}>
              <Components.Loading />
            </div>
          </div>

          {this.state.thumbnailUrl ? this.renderThumbnail() : this.renderNoThumbnail()}

          <Input
            type="hidden"
            name="thumbnailUrl"
            value={this.state.thumbnailUrl}
          />
        </div>
      </div>
    );
  }
}

EmbedURL.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string
}

EmbedURL.contextTypes = {
  updateCurrentValues: PropTypes.func,
  addToDeletedValues: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
  getDocument: PropTypes.func,
  intl: intlShape
}

const options = {
  name: 'getEmbedData',
  args: {url: 'String'},
}

export default withMutation(options)(EmbedURL);

registerComponent('EmbedURL', EmbedURL, [withMutation, options]);