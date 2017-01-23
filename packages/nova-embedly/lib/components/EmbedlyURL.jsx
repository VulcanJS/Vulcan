import { Components, registerComponent } from 'meteor/nova:lib';
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
      console.error('Error cleaning "media" property', error)
    }
  }

  // called whenever the URL input field loses focus
  async handleBlur() {
    try {
      await this.setState({loading: true});

      // value from formsy input ref
      const url = this.input.getValue();

      if (url.length) {
        // the URL has changed, get new title, body, thumbnail & media for this url
        const result = await this.props.getEmbedlyData({url});
        
        // uncomment for debug
        // console.log('Embedly Data', result);
        
        await this.context.updateCurrentValues({
          title: result.data.getEmbedlyData.title || "",
          body: result.data.getEmbedlyData.description || "",
          thumbnailUrl: result.data.getEmbedlyData.thumbnailUrl || "",
        });
        
        await this.setState({loading: false});
      }
    } catch(error) {
      await this.setState({loading: false});
      console.log(error); // eslint-disable-line no-console
      this.context.throwError({content: error.message, type: "error"});
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
    const {document, control, getEmbedlyData, ...rest} = this.props; // eslint-disable-line no-unused-vars

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
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

EmbedlyURL.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValues: React.PropTypes.func,
  throwError: React.PropTypes.func,
  actions: React.PropTypes.object,
}

export default withMutation({
  name: 'getEmbedlyData',
  args: {url: 'String'},
})(EmbedlyURL);
