import { getSetting } from 'meteor/vulcan:core';
import Embed from '../../modules/embed.js';

const extractBase = 'https://embedapi.com/api/embed';
const settings = getSetting('embedAPI');
const thumbnailWidth = getSetting('thumbnailWidth', 400);
const thumbnailHeight = getSetting('thumbnailHeight', 300);

if (settings) {

  const {apiKey} = settings;

  if(!apiKey) {
    // fail silently to still let the post be submitted as usual
    console.log("Couldn't find an EmbedAPI API key! Please add it to your Vulcan settings."); // eslint-disable-line
    return null;
  }

  Embed.embedAPI = {

    getData(url) {

      try {

        const result = Meteor.http.get(extractBase, {
          params: {
            key: apiKey,
            url: url,
            image_width: thumbnailWidth,
            image_height: thumbnailHeight,
            image_method: 'crop'
          }
        });

        const data = JSON.parse(result.content);

        const embedData = {
          title: data.title,
          description: data.description
        }
        
        if (data.pics && data.pics.length > 0) {
          embedData.thumbnailUrl = data.pics[0];
        }
        
        if (data.media ) {
          embedData.media = data.media;
        }

        if (data.authors && data.authors.length > 0) {
          embedData.sourceName = data.authors[0].name;
        }

        return embedData;

      } catch (error) {
        console.log('// EmbedAPI error') // eslint-disable-line
        console.log(error); // eslint-disable-line
        throw new Error(error.error_message);
      }
    },

  }

}

