import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class PrefilledThumbnail extends Component {

  constructor() {
    super();
    this.state={};
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    
    const nextThumbnailUrl = nextContext.prefilledValues && nextContext.prefilledValues.thumbnailUrl;
    const currentThumbnailUrl = this.context.prefilledValues && this.context.prefilledValues.thumbnailUrl;

    if (!!nextThumbnailUrl && nextThumbnailUrl != currentThumbnailUrl) {
      this.setState({thumbnailUrl: nextThumbnailUrl});
    }

    return true;
  }

  renderThumbnail() {
    return <img 
      className="embedly-thumbnail" 
      src={this.state.thumbnailUrl} 
      height={Telescope.settings.get('thumbnailHeight', 125)} 
      width={Telescope.settings.get('thumbnailWidth', 200)}
    />
  }

  render() {

    const {name, value, label} = this.props;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          {this.state.thumbnailUrl ? this.renderThumbnail() : null}
          <Input name={name} type="hidden" readOnly value={this.state.thumbnailUrl} />
        </div>
      </div>
    )
  }
}

PrefilledThumbnail.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

PrefilledThumbnail.contextTypes = {
  prefilledValues: React.PropTypes.object
}

export default PrefilledThumbnail;