import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import { newMutation, editMutation } from 'meteor/vulcan:core';
import moment from 'moment';




//Database Connection
const connectionString = "postgres://postgres:p0o9i8@localhost:5432/postgres";

//This variable determines whether we will import the date_pickle JSON file during the
// next startup, or whether we are going to export it. I didn't want to write a whole
// python integration, so we will just do it this hacky way.
const datePickleImport = true;

// This variable determines whether we will try to import legacy LessWrong data
// from a local postgres server.
const postgresImport = false;

// Constants related to various functionalities of the import
const POSTSNUMBER = 10
const POSTSMETANUMBER = 100
const COMMENTSNUMBER = 10
const USERNUMBER = 500

if (postgresImport) {
  let cn = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '' // Ommitted for obvious reasons
  }

  var options = {};
  //Import postgress-promises library
  var pgp = require("pg-promise")(options);
  var db = pgp(cn);

  //Import file management library
  var fs = require("fs")

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
    processedUsers.slice(0,USERNUMBER).forEach((user) => {
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


  // Post import (Reddit thing_link)

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

    // Write datetime python pickle objects to csv file, because the universe
    // hates me and I bet it originally seemed like a great idea to save
    // the date of a post in a python pickle instead of a dateTime string. We then
    // later import that csv in a python file, deconvert the pickles into strings
    // and then print them back

    datePickles = {};

    Object.keys(posts).slice(0,POSTSNUMBER).forEach((key) => {
      post_date = {
        id: key,
        datePickle: posts[key].date,
        date: "",
      };
      datePickles[key] = post_date;
    });

    datePicklesString = JSON.stringify(datePickles);


    if (datePickleImport) {
      let filepath = process.env["PWD"] + "/packages/lesswrong/lib/database-import/datePicklesOut.json";
      console.log("Importing Date Pickles from JSON file datePickles.json");
      f = fs.readFileSync(filepath, 'utf8');
      console.log("Read file");
      try {
        console.log(f);
        var dates = JSON.parse(f);
      } catch(err) {
        console.log(err);
      }
      // dates = fs.readFile(filepath, (err, data) => {
      //   if(err) {
      //     return console.log(err);
      //   }
      //   return JSON.parse(data);
      //   console.log("The file was read");
      // });
      console.log("FULL DATE FILE: ");
      console.log(dates);
      Object.keys(dates).forEach((key) => {
        posts[dates[key].id].date = dates[key].date;
      })
    } else {
        console.log("Exporting Date Pickles to JSON file");
        fs.writeFile(process.env["PWD"] + "/packages/lesswrong/lib/database-import/datePickles.json", datePicklesString, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
        });
    };

    processedPosts = [];
    Object.keys(posts).slice(0,POSTSNUMBER).forEach((key) => {
      let lwUser = Users.findOne({legacy: true, legacyId: key});
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
      if (posts[key].date) {
        console.log(posts[key].date);
        post.postedAt = moment(posts[key].date).toDate();
      }
      processedPosts.push(post);
    });
    // console.log("PROCESSED POSTS: ", processedPosts.slice(0,10))
    let i = 0;
    processedPosts.slice(0,POSTSNUMBER).forEach((post) => {
      user = Users.findOne({_id: post.userId});
      i++;
      // if ((i % 100) == 0) {
      //   console.log("Added Post: ", i);
      //   console.log(post)
      // };
      if (!Posts.findOne({legacy: post.legacy, legacyId: post.legacyId})) {
        // console.log("ADDED NEW POST");

        newMutation({
          collection: Posts,
          document: post,
          currentUser: user,
          validate: false,
        })
      };
    })
  }

  let processPostsMeta = (data) => {
    data.slice(0,POSTSMETANUMBER).forEach((row) => {
      post = Posts.findOne({legacy: true, legacyId: row.thing_id});
      if (post) {
        // console.log("Adding Meta Information to post: " + post.title);
        user = Users.findOne();
        set = {};
        if (row.deleted) {
          set.status = 3;
        };
        if (row.spam) {
          set.status = 3;
          set.legacySpam = true;
        };
        // console.log(set)
        editMutation({
          collection: Posts,
          documentId: post._id,
          set: set,
          validate: false,
        })
      };
    });
  }

  db.any('SELECT thing_id, ups, downs, deleted, spam, descendant_karma from reddit_thing_link', [true])
    .then((data) => {
      processPostsMeta(data);})
    .catch((err) => {
      console.log("Welp, we failed at processing posts. I am sorry.", err);
    })


  // Post import #2, adding the other LessWrong database
  // (For some reason LW had two tables relating to posts, one saving the name and
  //  one saving details on whether the post had been deleted or labeled as spam
  //  as well as the number of ups and downvotes)

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

    // console.log("UNPROCESSED COMMENT 1: ", comments['1']);
    // console.log("UNPROCESSED COMMENT 2: ", comments['2']);

    processedComments = [];
    Object.keys(comments).slice(0,COMMENTSNUMBER).forEach((key) => {
      author = Users.findOne({legacy: true, legacyId: comments[key].author_id});
      // console.log("ADDED COMMENT NR. : ");
      // console.log(key);
      //
      // console.log("AUTHOR: ");
      // console.log(author);
      post = Posts.findOne({legacy: true, legacyId: comments[key].link_id});
      // console.log("POST: ");
      // console.log(post);
      var comment = {
        legacy: true,
        legacyId: key,
        legacyParentId: comments[key].parent_id,
        postId: post._id,
        userId: author._id,
        body: comments[key].body,
        isDeleted: comments[key].retracted,
      };
      processedComments.push(comment);
    });

    processedComments.slice(0,COMMENTSNUMBER).forEach((comment) => {
      if (comment.legacyParentId) {
        parentComment = Comments.findOne({legacy: true, legacyId: comment.legacyParentId});
        comment.parentCommentId = parentComment._id;
        comment.topLevelCommentId = parentComment._id;
      }
      author = Users.findOne({_id: comment.userId});
      if (!Comments.findOne({legacy: true, legacyId: comment.legacyId})) {
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
};
