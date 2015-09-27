/* Constants */
FEED_PARSER_FREQUENCY_PROPERTY_NAME = 'feedParserFrequency';
FEED_PARSER_FREQUENCY_PROPERTY_DEFAULT_VALUE = 'every 30 minutes';

// used to keep track of which feed a post was imported from
var feedIdProperty = {
  fieldName: 'feedId',
  fieldSchema: {
    type: String,
    label: 'feedId',
    optional: true,
    autoform: {
      omit: true
    }
  }
};
Posts.addField(feedIdProperty);

// the RSS ID of the post in its original feed
var feedItemIdProperty = {
  fieldName: 'feedItemId',
  fieldSchema: {
    type: String,
    label: 'feedItemId',
    optional: true,
    autoform: {
      omit: true
    }
  }
};
Posts.addField(feedItemIdProperty);

// Custom Setting Field
Settings.addField({
  fieldName: FEED_PARSER_FREQUENCY_PROPERTY_NAME,
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      group: 'Feeds'
    }
  }
});
