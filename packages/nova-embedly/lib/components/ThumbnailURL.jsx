import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
const Input = FRC.Input;

class ThumbnailURL extends Component {

  renderThumbnail() {
    return <img 
      className="embedly-thumbnail" 
      src={this.props.value} 
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
          {this.props.value ? this.renderThumbnail() : null}
          <Input name={name} type="hidden" readOnly value={this.props.value} />
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

export default ThumbnailURL;