import fs from 'fs';
import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import { newMutation } from 'meteor/vulcan:core';

const hpmorImport = false;

if (hpmorImport) {
  let filepath = process.env["PWD"] + "/packages/lesswrong/assets/hpmor_data.json";
  let f = fs.readFileSync(filepath, 'utf8');
  console.log("Read file");
  try {
    // console.log(f);
    var hpmor_data = JSON.parse(f);
  } catch(err) {
    console.log(err);
  }

  const eliezerId = "nmk3nLpQE89dMRzzN"

  console.log(Object.keys(hpmor_data));
  console.log(hpmor_data.chapters[1]);
  Object.keys(hpmor_data.chapters).forEach(chapterNumber => {
    var post = {
      title: "HPMOR Chapter: " + chapterNumber,
      userId: eliezerId,
      draft: true,
      htmlBody: hpmor_data.chapters[chapterNumber],
    };
    chapterNumber++;

    const lwUser = Users.findOne({_id: eliezerId});
    const oldPost = Posts.findOne({title: post.title});

    if (!oldPost){
      newMutation({
        collection: Posts,
        document: post,
        currentUser: lwUser,
        validate: false,
      })
    } else {
      console.log("Post already imported: ", oldPost);
    }
  })
}
