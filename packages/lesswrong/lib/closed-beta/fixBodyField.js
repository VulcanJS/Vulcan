import Posts from 'meteor/vulcan:posts';
import h2p from 'html2plaintext';

const runFix = false;

if (runFix) {
  console.log("Running body field fix on database...");
  Posts.find().fetch().forEach((post) => {
    if (post.htmlBody) {
      const html = post.htmlBody;
      const plaintextBody = h2p(html);
      const excerpt =  plaintextBody.slice(0,140);
      Posts.update(post._id, {$set: {body: plaintextBody, excerpt: excerpt}});
    }
  })
}
