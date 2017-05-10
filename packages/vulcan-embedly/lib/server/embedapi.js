import {  getSetting } from 'meteor/vulcan:core';

export const embedAPI = function(url){
    
      var embedAPIKey = getSetting('embedAPIKey');
      var thumbnailWidth = getSetting('thumbnailWidth', 200);
      var thumbnailHeight = getSetting('thumbnailHeight', 200);
    
      if(!embedAPIKey) {
        // fail silently to still let the post be submitted as usual
        console.log("Couldn't find an Embed API key! Please add it or get one from embedAPI.com."); // eslint-disable-line
        return null;
      }
    
    try {
        var result = Meteor.http.get('https://EmbedAPI.com/api/embed', {
          params: {
            key: embedAPIKey,
            url: url,
            image_width: thumbnailWidth,
            image_height: thumbnailHeight,
            image_method: 'crop'
          }
        });
    
        result.content = JSON.parse(result.content);
        var embedData = {title: result.content.title ,description: result.content.description };
        
        if ( !_.isEmpty(result.content.pics) )
         embedData.thumbnailUrl = result.content.pics[0];
        
        if ( !!result.content.media )
        embedData.media = result.content.media;
        
        if ( !_.isEmpty(result.content.authors) ) {
         embedData.sourceName = result.content.authors[0].name;
         embedData.sourceUrl = result.content.authors[0].url;
        }
        //console.log("embedData",embedData)
        return embedData;
    
  } catch (error) {
    console.log(error); // eslint-disable-line
    // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest
    var errorObject = JSON.parse(error.message.substring(13));
    throw new Error(errorObject.error_code, errorObject.error_message);
  }
}
