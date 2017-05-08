import googleMaps from '@google/maps';
import { getSetting } from 'meteor/vulcan:core';

const googleMapsSetting = getSetting('googlemaps');

if (!googleMapsSetting) {
  throw new Error('Please fill in your Google Maps API Key or disable the Places package.');
}

const googleMapsClient = googleMaps.createClient({
  key: googleMapsSetting.apiKey
});

export const getPlaceDetails = (placeId, callback) => {
  googleMapsClient.place({
    placeid: placeId,
    language: getSetting('language', 'en')
  }, Meteor.bindEnvironment(callback));
}