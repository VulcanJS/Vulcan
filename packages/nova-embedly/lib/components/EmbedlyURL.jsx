import React, { PropTypes, Component } from 'react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class EmbedlyURL extends Component {

  constructor() {
    super();
    this.handleBlur = this.handleBlur.bind(this);
    this.state = {
      loading: false
    }
  }

  // called whenever the URL input field loses focus
  handleBlur() {

    this.setState({loading: true});

    // the URL has changed, get a new thumbnail
    Meteor.call("getEmbedlyData", this.input.getValue(), (error, result) => {
      
      console.log("querying Embedly…");
      
      this.setState({loading: false});

      if (error) {
        console.log(error)
        this.context.throwError({content: error.message, type: "error"});
      } else {
        console.log(result)
        this.context.addToPrefilledValues({
          title: result.title,
          body: result.description,
          thumbnailUrl: result.thumbnailUrl
        });
      }
    });
  }

  render() {
    
    const Loading = Telescope.components.Loading;

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

    return (
      <div className="embedly-url-field" style={wrapperStyle}>
        <Input 
          {...this.props}
          onBlur={this.handleBlur} 
          type="text"  
          ref={ref => this.input = ref}
        />
        <div className="embedly-url-field-loading" style={loadingStyle}>
          <Loading />
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
  addToPrefilledValues: React.PropTypes.func,
  throwError: React.PropTypes.func
}

export default EmbedlyURL;