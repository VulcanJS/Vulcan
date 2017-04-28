import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import { newMutation } from 'meteor/vulcan:core';




//Database Connection
let connectionString = "postgres://postgres:p0o9i8@localhost:5432/postgres";

let cn = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'p0o9i8'
}

var options = {};
var pgp = require("pg-promise")(options);
var db = pgp(cn);

//User Account import

console.log('Importing LessWrong users...');


let processUsers = (users) => {
  processedUsers = [];
  users.forEach((user) => {
    userSchema = {
      legacy: true,
      legacyId: user.thing_id,
      username: "LessWrong_user" + user.thing_id,
      email: "panisnecis+" + user.thing_id + "@gmail.com",
      profile: {
        isDummy: true,
      }
    };
    processedUsers.push(userSchema);
  });
  processedUsers.slice(0,500).forEach((user) => {
    if (!Users.findOne({legacy: true, legacyId: user.legacyId})) {
      Accounts.createUser(user);
    };
  })
  // If account does not exist yet, create it

};



db.any('SELECT thing_id, deleted from reddit_thing_account', [true])
  .then((data) => {
    processUsers(data);})
  .catch((err) => {
    console.log("Welp, we failed. I am sorry.", err);
  });



let processPosts = (post_rows) => {
  posts = {};
  post_rows.forEach((row) => {
    // If post does not exist in post dictionary, initiate it
    if (!posts[row.thing_id]) {
      posts[row.thing_id] = {};
    };
    if (row.value) {
      posts[row.thing_id][row.key] = row.value;
    };
  });

  processedPosts = [];
  Object.keys(posts).forEach((key) => {
    var username = "LessWrong_user" + posts[key].author_id;
    let lwUser = Users.findOne({username: username});
    var post = {
      legacy: true,
      legacyId: key,
      title: posts[key].title,
      isDummy: true,
      userId: lwUser._id,
      htmlBody: posts[key].article,
      userIP: posts[key].ip,
    };
    if (posts[key].url.substring(0,7) == "http://") {
      post.url = posts[key].url;
    }
    processedPosts.push(post);
  });
  console.log("PROCESSED POSTS: ", processedPosts.slice(0,10))
  let i = 0;
  processedPosts.slice(0,100).forEach((post) => {
    user = Users.findOne({_id: post.userId});
    i++;
    if ((i % 100) == 0) {
      console.log("Added Post: ", i);
      console.log(post)
    };
    if (!Posts.findOne({legacy: post.legacy, legacyId: post.legacyId})) {
      console.log("ADDED NEW POST");
      newMutation({
        collection: Posts,
        document: post,
        currentUser: user,
        validate: false,
      })
    };
  })
}

db.any('SELECT thing_id, key, value from reddit_data_link', [true])
  .then((data) => {
    processPosts(data);})
  .catch((err) => {
    console.log("Welp, we failed at processing posts. I am sorry.", err);
  })

let processComments = (comment_rows) => {
  comments = {};
  comment_rows.forEach((row) => {
    // If comment does not exist in comment dictionairy, initiate it
    if (!comments[row.thing_id]) {
      comments[row.thing_id] = {};
    }
    comments[row.thing_id][row.key] = row.value;
  });

  console.log("UNPROCESSED COMMENT 1: ", comments['1']);
  console.log("UNPROCESSED COMMENT 2: ", comments['2']);

  processedComments = [];
  Object.keys(comments).slice(0,100).forEach((key) => {
    author = Users.findOne({legacy: true, legacyId: comments[key].author_id});
    var comment = {
      legacy: true,
      legacyId: key,
      postId: comments[key].link_id,
      userId: author._id,
      parentCommentId: comments[key].parent_id,
      body: comments[key].body,
      isDeleted: comments[key].retracted,
    }
    processedComments.push(comment);
  });
  processedComments.slice(0,100).forEach((comment) => {
    author = Users.findOne({_id: comment.userId});
    if (!Comments.findOne({legacy: true, legacyId: key})) {
      console.log("Added new comment: ");
      newMutation({
        collection: Comments,
        document: comment,
        currentUser: author,
        validate: false,
      })
    };
  });

};

db.any('SELECT thing_id, key, value from reddit_data_comment', [true])
  .then((data) => {
    processComments(data);})
  .catch((err) => {
    console.log("Welp, we failed at processing comments. I am sorry.", err);
  });
