const feedparser = require('feedparser-promised');

console.log("Grabbing feeds")
const url = 'http://slatestarcodex.com/feed/';
feedparser.parse(url).then( (items) => {
  items.forEach( (item) => {
    // console.log(`title: ${item.title}`);
  });
}).catch( (error) => {
  console.log('error: ', error);
});
