/* eslint-disable quote-props */

// const text = `Once upon a time there was a new Editor. It was all about unicorns and supported features like #hashtags. It's creators like Jyoti, Nik or Julian could mentioned. Of course it also supports unicorn stickers like this one:
//
// Of course it also supports Emojis 🤓 🎉`;

const initialState = {
  'entityMap': {
    '0': {
      'type': 'mention',
      'mutability': 'SEGMENTED',
      'data': {
        'mention': {
          'name': 'Jyoti Puri',
          'link': 'https://twitter.com/jyopur',
          'avatar': 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400'
        }
      }
    },
    '1': {
      'type': 'mention',
      'mutability': 'SEGMENTED',
      'data': {
        'mention': {
          'name': 'Nik Graf',
          'link': 'https://twitter.com/nikgraf',
          'avatar': 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400'
        }
      }
    },
  },
  'blocks': [{
    'key': '5ncb4',
    'text': 'Once upon a time there was a new Editor. It was all about unicorns and supported features like #hashtags. It\'s creators like Jyoti Puri or Nik Graf can be mentioned. The editor also supports unicorn stickers. Add one by clicking the icon with the smiley below.',
    'type': 'unstyled',
    'depth': 0,
    'inlineStyleRanges': [],
    'entityRanges': [{
      'offset': 125,
      'length': 10,
      'key': 0
    }, {
      'offset': 139,
      'length': 8,
      'key': 1
    }]
  }, {
    'key': 'mlp',
    'text': '',
    'type': 'unstyled',
    'depth': 0,
    'inlineStyleRanges': [],
    'entityRanges': []
  }, {
    'key': '3dk28',
    'text': 'Of course it comes with Emoji support 🤓 🎉 … type in a colon and add yours here',
    'type': 'unstyled',
    'depth': 0,
    'inlineStyleRanges': [],
    'entityRanges': []
  }]
};

export default initialState;
