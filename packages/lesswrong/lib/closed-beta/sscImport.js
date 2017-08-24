import feedparser from 'feedparser-promised';
import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import { newMutation } from 'meteor/vulcan:core';

const sscImport = false;

// check the feed for new posts
const url = "http://slatestarcodex.com/feed/?paged=";
let sscPageImports = [];
async function importSSC () {
  for (let i of _.range(1,77)) {
    const newPosts = await feedparser.parse(url+i)
    console.log("Importing Slatestarcodex posts page " + i);
    const scottId = "XgYW5s8njaYrtyP7q";
    sscPageImports.push(i);
    console.log("SSC Pages Imported So far: ", sscPageImports.sort());

    newPosts.forEach(function (newPost) {
      var body;

      if (newPost['content:encoded'] && newPost.displayFullContent) {
        body = newPost['content:encoded'];
      } else if (newPost.description) {
        body = newPost.description;
      } else if (newPost.summary) {
        body = newPost.summary;
      } else {
        body = "";
      }

      var post = {
        title: newPost.title,
        postedAt: newPost.pubdate,
        userId: scottId,
        htmlBody: body,
      };

      const lwUser = Users.findOne({_id: scottId});
      const oldPost = Posts.findOne({title: post.title});


      if (!oldPost){
        newMutation({
          collection: Posts,
          document: post,
          currentUser: lwUser,
          validate: false,
        })
      } else {
        console.log("Post already imported: ", oldPost.title);
      }
    })
  }
}
if (sscImport) {
  importSSC();
}
