import { Components, registerComponent, Utils } from 'meteor/nova:core';
import { withMutation } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import FRC from 'formsy-react-components';

const Input = FRC.Input;

class EmbedlyURL extends Component {

  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    
    this.state = {
      loading: false,
      value: props.value || '',
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

  // called whenever the URL input field loses focus
  async handleBlur() {
    try {
      // value from formsy input ref
      const url = this.input.getValue();
      
      // start the mutation only if the input has a value
      if (url.length) {
        
        // notify the user that something happens
        await this.setState({loading: true});

        // the URL has changed, get new title, body, thumbnail & media for this url
        const result = await this.props.getEmbedlyData({url});
        
        // uncomment for debug
        // console.log('Embedly Data', result);
        
        // extract the relevant data, for easier consumption
        const { data: { getEmbedlyData: { title, description, thumbnailUrl } } } = result;
        
        // update the form
        await this.context.updateCurrentValues({
          title: title || "",
          body: description || "",
          thumbnailUrl: thumbnailUrl || "",
        });
        
        // embedly component is done
        await this.setState({loading: false});
        
        // remove errors & keep the current values 
        await this.context.clearForm({clearErrors: true}); 
      }
    } catch(error) {
      
      console.error(error); // eslint-disable-line
      const errorMessage = error.message.includes('401') ? Utils.encodeIntlError({id: "app.embedly_not_authorized"}) : error.message; 
      
      // embedly component is done
      await this.setState({loading: false});
      
      // something bad happened
      await this.context.throwError(errorMessage);
    }
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
    const {document, control, getEmbedlyData, ...rest} = this.props; // eslint-disable-line

    return (
      <div className="embedly-url-field" style={wrapperStyle}>
        <Input
          {...rest}
          onBlur={this.handleBlur}
          type="text"
          ref={ref => this.input = ref}
        />
        <div className="embedly-url-field-loading" style={loadingStyle}>
          <Components.Loading />
        </div>
      </div>
    );
  }
}

EmbedlyURL.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  label: PropTypes.string
}

EmbedlyURL.contextTypes = {
  updateCurrentValues: PropTypes.func,
  throwError: PropTypes.func,
  clearForm: PropTypes.func,
}

export default withMutation({
  name: 'getEmbedlyData',
  args: {url: 'String'},
})(EmbedlyURL);
