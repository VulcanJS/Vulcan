/**
* This script must be called like this:
* node childProcessScript.js <PARENT_PID> <COMMAND> <COMMAND_ARGUMENTS...>
*
* You can terminate this script by sending a SIGINT signal to it.
* It will also terminate automatically when the process with the given
* parent PID no longer runs.
*/

DEBUG = !!process.env.VELOCITY_DEBUG;

/**
* This is the same mechanism that Meteor currently use for parent alive checking.
* @see webapp package.
*/
var startCheckForLiveParent = function (parentPid) {
  setInterval(function () {
    try {
      process.kill(parentPid, 0)
    } catch (err) {
      DEBUG && console.log("Parent process is dead! Exiting.")
      childProcess.kill('SIGINT')
      process.exit(1)
    }
  }, 3000)
}

var parentPid = process.argv[2]
var command = process.argv[3]
var commandArgumentsz = process.argv.slice(4)

DEBUG && console.log('Spawn script arguments:')
DEBUG && console.log('parentPid:', parentPid)
DEBUG && console.log('command:', command)
DEBUG && console.log('commandArguments:', commandArgumentsz)

var spawn = require('child_process').spawn
var childProcess = spawn(command, commandArgumentsz, {
  cwd: process.cwd,
  env: process.env,
  stdio: 'inherit'
})

startCheckForLiveParent(parentPid)

process.on('SIGINT', function () {
  DEBUG && console.log('Received SIGINT. Exiting spawn script.')
  childProcess.kill('SIGINT')
  process.exit(1)
})