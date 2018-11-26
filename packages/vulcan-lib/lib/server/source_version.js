import childProcess from 'child_process';

/*

Get latest commit hash from either env variables (set with Mup for example)
or current child process.

See https://github.com/zodern/meteor-up/issues/807#issuecomment-346915622

*/
const getSourceVersionFromGit = () => {
  const cmd = 'git rev-parse HEAD';
  try {
    childProcess
      .execSync(cmd)
      .toString()
      .trim();
  } catch (err) {
    console.error(`Error: could not get source version from command ${cmd}`, err);
    return undefined;
  }
};
export const sourceVersion = process.env.SOURCE_VERSION || getSourceVersionFromGit() || '';
