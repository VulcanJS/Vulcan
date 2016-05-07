import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class ThumbnailURL extends Component {

  constructor(props) {
    super(props);
    this.clearThumbnail = this.clearThumbnail.bind(this);
    this.state = {
      value: props.value
    };
  }

  clearThumbnail() {
    this.setState({
      value: ""
    });
  }

  renderThumbnail() {
    return (
      <div>
          <img 
            className="embedly-thumbnail" 
            src={this.props.value} 
            height={Telescope.settings.get('thumbnailHeight', 125)} 
            width={Telescope.settings.get('thumbnailWidth', 200)}
            />
          <a className="thumbnail-url-clear" onClick={this.clearThumbnail}>Clear Thumbnail</a>
      </div>
    )
  }

  render() {

    const {name, value, label} = this.props;

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          {this.state.value ? this.renderThumbnail() : null}
          <Input name={name} type="hidden" readOnly value={this.state.value} />
        </div>
      </div>
    )
  }
}

ThumbnailURL.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
}

ThumbnailURL.contextTypes = {
  addToPrefilledValues: React.PropTypes.func,
  deleteValue: React.PropTypes.func
}

export default ThumbnailURL;