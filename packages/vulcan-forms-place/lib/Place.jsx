import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

class Place extends Component {

  constructor(props) {
    super(props);
    this.state = { address: '' };
    this.onChange = (address) => this.setState({ address });
    this.onBlur = this.onBlur.bind(this);
  }

  onBlur() {
    
    const address = this.state.address;

    geocodeByAddress(address,  (err, latLng) => {
      if (err) { console.log(err) }
      this.context.addToAutofilledValues({
        placeName: address,
        placeLat: latLng.lat,
        placeLong: latLng.lng
      });
    });

  }

  render() {

    const inputProps = {
      value: this.state.address, 
      onChange: this.onChange,
      onBlur: this.onBlur
    }

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <PlacesAutocomplete inputProps={inputProps} />
        </div>
      </div>
    );
  }
}

Place.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.any,
  label: React.PropTypes.string
};

Place.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
}

registerComponent('Place', Place);

export default Place;