import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import FRC from 'formsy-react-components';

const Input = FRC.Input;

class Place extends Component {

  constructor(props) {
    super(props);
    this.state = { address: props.value, placeName: props.value };
    this.onChange = (address) => this.setState({ address });
    this.onSelect = (address, placeId) => this.setState({ address, placeId });
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.placesService = new window.google.maps.places.PlacesService(document.createElement('div'))
    }
  }

  onBlur() {
    
    const {placeId} = this.state;

    this.placesService.getDetails({placeId}, (result) => {
      console.log(result)
      
      this.setState({placeName: result.name});

      this.context.addToAutofilledValues({
        placeName: result.name,
        placeId: placeId,
        placeLat: result.geometry.location.lat(),
        placeLng: result.geometry.location.lng()
      });
    });

    // geocodeByAddress(address,  (err, latLng) => {
    //   if (err) { console.log(err) }
    //   this.context.addToAutofilledValues({
    //     placeName: address,
    //     placeLat: latLng.lat,
    //     placeLong: latLng.lng
    //   });
    // });

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
          <PlacesAutocomplete inputProps={inputProps} onSelect={this.onSelect} />
          <Input name={this.props.name} type="hidden" readOnly value={this.state.placeName} />
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