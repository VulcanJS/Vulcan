import { Headtags, getSetting } from 'meteor/vulcan:core';

const googlemaps = getSetting('googlemaps');

if (googlemaps && googlemaps.apiKey) {

  Headtags.script.push({
    type: 'text/javascript',
    src: `https://maps.googleapis.com/maps/api/js?key=${googlemaps.apiKey}&libraries=places`
  });

}