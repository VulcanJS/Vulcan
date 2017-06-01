import { getSetting } from 'meteor/vulcan:core';
import Embed from '../../modules/embed.js';

const extractBase = 'http://api.embed.ly/1/extract';
const settings = getSetting('embedly');
const thumbnailWidth = getSetting('thumbnailWidth', 400);
const thumbnailHeight = getSetting('thumbnailHeight', 300);

if (settings) {

  const {apiKey} = settings;

  if(!apiKey) {
    // fail silently to still let the post be submitted as usual
    console.log("Couldn't find an Embedly API key! Please add it to your Vulcan settings."); // eslint-disable-line
    return null;
  }

  Embed.embedly = {

    getData(url) {

      try {

        const data = Meteor.http.get(extractBase, {
          params: {
            key: apiKey,
            url: url,
            image_width: thumbnailWidth,
            image_height: thumbnailHeight,
            image_method: 'crop'
          }
        }).data;


        if (data.images && data.images.length > 0) // there may not always be an image
          data.thumbnailUrl = data.images[0].url.replace("http:","") // add thumbnailUrl as its own property

        if (data.authors && data.authors.length > 0) {
          data.sourceName = data.authors[0].name;
          data.sourceUrl = data.authors[0].url;
        }

        const embedlyData = _.pick(data, 'title', 'media', 'description', 'thumbnailUrl', 'sourceName', 'sourceUrl');

        return embedlyData;

      } catch (error) {
        console.log('// Embedly error')
        console.log(error); // eslint-disable-line
        // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest
        const errorObject = JSON.parse(error.message.substring(13));
        throw new Error(errorObject.error_message);
      }
    },

  }

}

