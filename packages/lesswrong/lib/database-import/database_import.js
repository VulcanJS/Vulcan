import Users from 'meteor/vulcan:users';
import Posts from 'meteor/vulcan:posts';
import Comments from 'meteor/vulcan:comments';
import { newMutation, editMutation } from 'meteor/vulcan:core';
import moment from 'moment';

// Import file-management library
import fs from 'fs';

//This variable determines whether we will import the date_pickle JSON file during the
// next startup, or whether we are going to export it. I didn't want to write a whole
// python integration, so we will just do it this hacky way.
const DATEIMPORT = false;

// This variable determines whether we will try to import legacy LessWrong data
// from a local postgres server.
const postgresImport = false;

// Constants related to various functionalities of the import
const POSTSNUMBER = 10
const POSTSMETANUMBER = 10
const COMMENTSNUMBER = 10
const COMMENTSMETANUMBER = 10
const USERNUMBER = 500
const USERMETANUMBER = 500

if (postgresImport) {
  let cn = {
    host: 'localhost',
    port: 5432,
    database: 'discordius',
    user: 'discordius',
    password: '' // Ommitted for obvious reasons
  }

  var options = {};
  //Import postgress-promises library
  var pgp = require("pg-promise")(options);
  var db = pgp(cn);

  //User Account import

  let processUsersData = (user_rows) => {
    users = {};

    //Create an object for each user, based on thing_id
    user_rows.forEach((row) => {
      if (!users[row.thing_id]) {
        users[row.thing_id] = {};
        users[row.thing_id]['legacyId'] = row.thing_id;
      };
      if (row.value) {
        users[row.thing_id][row.key] = row.value;
      };
    });

    processedUsers = [];

    Object.keys(users).forEach((key) => {
      userSchema = {
        legacy: true,
        legacyId: users[key].legacyId,
        legacyData: users[key],
        username: users[key].name,
        email: users[key].email,
        services: {},
        isDummy: true,
        profile: {
          url: users[key].pref_url,
        },
      }
      processedUsers.push(userSchema);
    });

    processedUsers.slice(0,USERNUMBER).forEach((user) => {
      // If account does not exist yet, create it
      if (!Users.findOne({legacy: true, legacyId: user.legacyId})) {
        try {
          // console.log("Added new user: ")
          newMutation({
            collection: Users,
            document: user,
            validate: false
          });
        } catch(err) {
          console.log(err)
          // If account creation fails, try again without email address.
          // LW 1.0 didn't validate the email addresses, so we have some Invalid
          // email addresses in the database, that we don't want to copy over.
          delete user.email;
          newMutation({
            collection: Users,
            document: user,
            validate: false
          });
        }
      };
    });
  };

  let processUsersMeta = (users) => {
    users.slice(0,USERMETANUMBER).forEach((user) => {
      user = Users.findOne({legacy: true, legacyId: user.thing_id});
      if (user) {
        set = {
          createdAt: moment(user.date).toDate(),
        };
        if (user.deleted) {
          set.deleted = true;
        };
        editMutation({
          collection: Users,
          documentId: user._id,
          set: set,
          validate: false,
        })
      };
    });
  };

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

    console.log("Exporting Date Pickles to JSON file");
    fs.writeFile(process.env["PWD"] + "/packages/lesswrong/lib/database-import/datePickles.json", datePicklesString, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });

    processedPosts = [];
    Object.keys(posts).slice(0,POSTSNUMBER).forEach((key) => {
      let lwUser = Users.findOne({legacy: true, legacyId: key});
      var post = {
        legacy: true,
        legacyId: key,
        legacyData: posts[key],
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
    // console.log("PROCESSED POSTS: ", processedPosts.slice(0,10))
    processedPosts.slice(0,POSTSNUMBER).forEach((post) => {
      user = Users.findOne({_id: post.userId});
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
    data.forEach((row) => {
      post = Posts.findOne({legacy: true, legacyId: row.thing_id});
      if (post) {
        // console.log("Adding Meta Information to post: " + post.title);
        user = Users.findOne();
        set = {
          postedAt: moment(row.date).toDate(),
        };
        // console.log(set);
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
  };

  // Comment Import

  let processComments = (comment_rows) => {
    comments = {};
    comment_rows.forEach((row) => {
      // If comment does not exist in comment dictionairy, initiate it
      if (!comments[row.thing_id]) {
        comments[row.thing_id] = {};
      }
      if (row.value) {
        comments[row.thing_id][row.key] = row.value;
      }
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
        legacyData: comments[key],
        postId: post._id,
        userId: author._id,
        body: comments[key].body,
        retracted: comments[key].retracted,
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
        // console.log("Added new comment: ");
        newMutation({
          collection: Comments,
          document: comment,
          currentUser: author,
          validate: false,
        })
      };
    });

  };

  let processCommentsMeta = (data) => {
    data.slice(0,COMMENTSMETANUMBER).forEach((row) => {
      comment = Comments.findOne({legacy: true, legacyId: row.thing_id});
      if (comment) {
        // console.log("Adding Meta Information to post: " + post.title);
        user = Users.findOne();
        set = {
          postedAt: moment(row.date).toDate()
        };
        if (row.deleted) {
          set.deleted = true;
        };
        if (row.spam) {
          set.spam = true;
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
  };

  // Date Import (for Posts)

  let datePickleImport = () => {

    let filepath = process.env["PWD"] + "/packages/lesswrong/lib/database-import/datePicklesOut.json";
    console.log("Importing Date Pickles from JSON file datePickles.json");
    f = fs.readFileSync(filepath, 'utf8');
    console.log("Read file");
    try {
      // console.log(f);
      var dates = JSON.parse(f);
    } catch(err) {
      console.log(err);
    }
    // console.log("FULL DATE FILE: ");
    // console.log(dates);
    Object.keys(dates).forEach((key) => {
      post = Posts.findOne({legacy: true, legacyId: dates[key].id});
      set = {
        createdAt: dates[key].date,
      };
      editMutation({
        collection: Posts,
        documentId: post._id,
        set: set,
        validate: false,
      })
    });
  };

  console.log('Importing LessWrong users...');

  function queryAndProcessUsers() {
    db.any('SELECT thing_id, key, value from reddit_data_account', [true])
      .then((data) => {
        processUsersData(data);
        console.log("Finished processing user data, processing user metadata...");
        queryAndProcessUsersMeta();
      })
      .catch((err) => {
        console.log("Welp, we failed at processing importing LessWrong 1.0 user data. We are sorry.", err);
      });
  };

  function queryAndProcessUsersMeta() {
    db.any('SELECT thing_id, deleted, date from reddit_thing_account', [true])
      .then((data) => {
        processUsersMeta(data);
        console.log("Finished processing user metadata, processing post data...");
        queryAndProcessPosts();
      })
      .catch((err) => {
        console.log("Welp, we failed at processing processing LessWrong 1.0 user metadata. We are sorry.", err);
      });
  };

  function queryAndProcessPosts() {
    db.any('SELECT thing_id, key, value from reddit_data_link', [true])
      .then((data) => {
        processPosts(data);
        console.log("Finished processing posts, processing post metadata...");
        queryAndProcessPostsMeta();
      })
      .catch((err) => {
        console.log("Welp, we failed at processing LessWrong 1.0 post data. I am sorry.", err);
      })
  };

  function queryAndProcessPostsMeta() {
    db.any('SELECT thing_id, ups, downs, deleted, spam, descendant_karma, date from reddit_thing_link', [true])
      .then((data) => {
        processPostsMeta(data);
        console.log("Finished processing post metadata, processing comments...");
        queryAndProcessComments();
      })
      .catch((err) => {
        console.log("Welp, we failed at processing LessWrong 1.0 post metadata. I am sorry.", err);
      })
  };

  function queryAndProcessComments() {
    db.any('SELECT thing_id, key, value from reddit_data_comment', [true])
      .then((data) => {
        processComments(data);
        console.log("Finished processing comments, processing comment metadata...")
        queryAndProcessCommentsMeta();
      })
      .catch((err) => {
        console.log("Welp, we failed at processing LessWrong 1.0 comment data. I am sorry.", err);
      });
  };

  function queryAndProcessCommentsMeta() {
    db.any('SELECT deleted, spam, date from reddit_thing_comment', [true])
      .then((data) => {
        processCommentsMeta(data);
        console.log("Finished processing comment metadata, dataimport is completed.");
      })
      .catch((err) => {
        console.log("Welp, we failed at processing LessWrong 1.0 comment metadata data. I am sorry.", err);
      });
  }

  queryAndProcessUsers();

  // db.any('SELECT thing_id, key, value from reddit_data_account', [true])
  //   .then((data) => {
  //     processUsersData(data);})
  //   .catch((err) => {
  //     console.log("Welp, we failed at processing importing LessWrong 1.0 user data. We are sorry.", err);
  //   });
  //
  // db.any('SELECT thing_id, deleted, date from reddit_thing_account', [true])
  //   .then((data) => {
  //     processUsersMeta(data);})
  //   .catch((err) => {
  //     console.log("Welp, we failed at processing processing LessWrong 1.0 user metadata. We are sorry.", err);
  //   });
  //
  // db.any('SELECT thing_id, key, value from reddit_data_link', [true])
  //   .then((data) => {
  //     processPosts(data);})
  //   .catch((err) => {
  //     console.log("Welp, we failed at processing posts. I am sorry.", err);
  //   })
  //
  // db.any('SELECT thing_id, ups, downs, deleted, spam, descendant_karma, date from reddit_thing_link', [true])
  //   .then((data) => {
  //     processPostsMeta(data);})
  //   .catch((err) => {
  //     console.log("Welp, we failed at processing posts. I am sorry.", err);
  //   })
  //
  // db.any('SELECT thing_id, key, value from reddit_data_comment', [true])
  //   .then((data) => {
  //     processComments(data);})
  //   .catch((err) => {
  //     console.log("Welp, we failed at processing comments. I am sorry.", err);
  //   });

  // if (DATEIMPORT) {
  //   datePickleImport();
  // }

};
