import childProcess from 'child_process';

/*

Get latest commit hash from either Meteor.gitCommitHash or env variables (set with Mup for example)
or current child process

See https://github.com/zodern/meteor-up/issues/807#issuecomment-346915622
And https://github.com/meteor/meteor/pull/10442

*/
export const getSourceVersion = () => {
  if (Meteor && Meteor.gitCommitHash) {
    return Meteor.gitCommitHash;
  } else {
    try {
      return (
        process.env.SOURCE_VERSION ||
        childProcess
          .execSync('git rev-parse HEAD')
          .toString()
          .trim()
      );
    } catch (error) {
      return null;
    }
  }
};
