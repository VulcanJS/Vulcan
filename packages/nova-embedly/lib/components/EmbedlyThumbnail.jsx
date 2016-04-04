import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class EmbedlyThumbnail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      thumbnailUrl: props.value,
      loading: false
    };
  }

  // will trigger every time the context (i.e. form values) changes
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    
    const nextUrl = nextContext.currentValues && nextContext.currentValues.url;
    const currentUrl = this.context.currentValues && this.context.currentValues.url;

    if (!!nextUrl && nextUrl != currentUrl) {

      this.setState({loading: true});

      // the URL has changed, get a new thumbnail
      Meteor.call("getEmbedlyData", nextUrl, (error, result) => {
        
        console.log("querying Embedly…");
        
        this.setState({loading: false});

        if (error) {
          console.log(error)
          this.context.throwError({content: error.message, type: "error"});
        } else {
          this.setState({
            thumbnailUrl: result.thumbnailUrl
          });
        }
      });
    }
    return true;
  }

  renderThumbnail() {

    const currentUrl = this.context.currentValues && this.context.currentValues.url;

    return currentUrl ? <img 
            className="embedly-thumbnail" 
            src={this.state.thumbnailUrl} 
            height={Telescope.settings.get('thumbnailHeight', 125)} 
            width={Telescope.settings.get('thumbnailWidth', 200)}
          /> : null;
  }

  render() {

    const {name, value, label} = this.props;

    Loading = Telescope.components.Loading;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          {this.state.loading ? <Loading /> : this.renderThumbnail()}
          <Input name={name} type="hidden" readOnly value={this.state.thumbnailUrl} />
        </div>
      </div>
    )
  }
}

EmbedlyThumbnail.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

EmbedlyThumbnail.contextTypes = {
  currentValues: React.PropTypes.object,
  throwError: React.PropTypes.func
}

export default EmbedlyThumbnail;