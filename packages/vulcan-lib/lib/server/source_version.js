import childProcess from 'child_process';

/*

Get latest commit hash from either env variables (set with Mup for example)
or current child process.

See https://github.com/zodern/meteor-up/issues/807#issuecomment-346915622

*/
export const getSourceVersion = () => {
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
};
