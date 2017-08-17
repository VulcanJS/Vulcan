import Users from 'meteor/vulcan:users';

const fixKarma = false;
const mainPostKarmaWeight = 10;
const mainCommentKarmaWeight = 1;
const discussionPostKarmaWeight = 1;
const discussionCommentKarmaWeight = 1;
const upvoteWeight = 1;
const downvoteWeight = 1;

if (fixKarma) {
  let usersCount = 0;
  Users.find().fetch().forEach((user) => {
    if (user.legacy) {
      // Function to deal with fields sometimes being undefined. Casts undefined to 0;
      const f = (number) => number || 0;
      const mainPostKarma = upvoteWeight * f(user.legacyData.karma_ups_link_lesswrong) - downvoteWeight * f(user.legacyData.karma_downs_link_lesswrong);

      const mainCommentKarma = upvoteWeight *  f(user.legacyData.karma_ups_comment_lesswrong) -
      downvoteWeight * f(user.legacyData.karma_downs_comment_lesswrong)

      const discussionPostKarma = upvoteWeight * f(user.legacyData.karma_ups_link_discussion) - downvoteWeight * f(user.legacyData.karma_downs_link_discussion)

      const discussionCommentKarma = upvoteWeight * f(user.legacyData.karma_ups_comment_discussion) - downvoteWeight  * f(user.legacyData.karma_downs_comment_discussion)

      const karma = mainPostKarmaWeight * mainPostKarma + mainCommentKarmaWeight * mainCommentKarma + discussionPostKarmaWeight * discussionPostKarma + discussionCommentKarmaWeight * discussionCommentKarma

      Users.update({_id: user._id}, {$set :{karma: karma}});
      usersCount++;

      if (usersCount % 1000 == 0 ){
        console.log("Updated karma of n users: ", usersCount);
      }
    }
  })
}
