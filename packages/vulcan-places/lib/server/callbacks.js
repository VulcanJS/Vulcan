import { addCallback, newMutation } from 'meteor/vulcan:core';
import Places from '../modules/collection.js';
import { getPlaceDetails } from './googlemaps.js';

const formatPlace = result => {
  const data = result.json.result;
  const place = _.pick(data, ['name', 'url', 'website', 'adr_address']);
  place._id = result.json.result.place_id;
  place.location = { type: 'Point', coordinates: [ data.geometry.location.lat, data.geometry.location.lng ] }
  return place;
}

const checkAndAddPlace = placeId => {
  const existingPlace = Places.findOne({placeId});

  if (!existingPlace) {

    getPlaceDetails(placeId, (error, result) => {

      const place = formatPlace(result);

      return newMutation({
        collection: Places,
        document: place, 
        validate: false,
      });
    
    });

  }
}

function postsNewCheckForNewPlace (document, user) {
  if (document.placeId) checkAndAddPlace(document.placeId);
}
addCallback('posts.new.async', postsNewCheckForNewPlace);

function postsEditCheckForNewPlace (document) {
  if (document.placeId) checkAndAddPlace(document.placeId);
}
addCallback('posts.edit.async', postsEditCheckForNewPlace);
