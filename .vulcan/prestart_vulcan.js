#!/usr/bin/env node

//Functions
var fs         = require('fs');
function existsSync(filePath){
  try{
    fs.statSync(filePath);
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
}

function copySync(origin,target){
  try{
    fs.writeFileSync(target, fs.readFileSync(origin));
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
}

//Add Definition Colors
const chalk = require('chalk');

//Vulcan letters
console.log(chalk.gray(' ___    ___ '));
console.log(chalk.gray(' '+String.fromCharCode(92))+chalk.redBright(String.fromCharCode(92))+chalk.dim.yellow(String.fromCharCode(92))+chalk.gray(String.fromCharCode(92)+'  /')+chalk.dim.yellow('/')+chalk.yellowBright('/')+chalk.gray('/'));
console.log(chalk.gray('  '+String.fromCharCode(92))+chalk.redBright(String.fromCharCode(92))+chalk.dim.yellow(String.fromCharCode(92))+chalk.gray(String.fromCharCode(92))+chalk.gray('/')+chalk.dim.yellow('/')+chalk.yellowBright('/')+chalk.gray('/    Vulcan.js'));
console.log(chalk.gray('   '+String.fromCharCode(92))+chalk.redBright(String.fromCharCode(92))+chalk.dim.yellow(String.fromCharCode(92))+chalk.dim.yellow('/')+chalk.yellowBright('/')+chalk.gray('/    The full-stack React+GraphQL framework'));
console.log(chalk.gray('    ────     '));


var os = require('os');
var exec = require('child_process').execSync;
var options = {
  encoding: 'utf8'
};
//Check Meteor and install if not installed
var checker = exec("meteor --version", options);
if (!checker.includes("Meteor ")) {
console.log("Vulcan requires Meteor but it's not installed. Trying to Install...");
  //Check platform
  if (os.platform()=='darwin') {
    //Mac OS platform
    console.log("🌋  "+chalk.bold.yellow("Good news you have a Mac and we will install it now! }"));
    console.log(exec("curl https://install.meteor.com/ | bash", options));
  } else if (os.platform()=='linux') {
    //GNU/Linux platform
    console.log("🌋  "+chalk.bold.yellow("Good news you are on  GNU/Linux platform and we will install Meteor now!"));
    console.log(exec("curl https://install.meteor.com/ | bash", options));
  } else if (os.platform()=='win32') {
    //Windows NT platform
      console.log(">  "+chalk.bold.yellow("Oh no! you are on a Windows platform and you will need to install Meteor Manually!"));
      console.log(">  "+chalk.dim.yellow("Meteor for Windows is available at: ")+chalk.redBright("https://install.meteor.com/windows"));
      process.exit(-1)
  }
} else {
//Check exist file settings and create if not exist
if (!existsSync("settings.json")) {
  console.log(">  "+chalk.bold.yellow("Creating your own settings.json file...\n"));
  if (!copySync("sample_settings.json","settings.json")) {
    console.log(">  "+chalk.bold.red("Error Creating your own settings.json file...check files and permissions\n"));
    process.exit(-1);
  }
}

  console.log(">  "+chalk.bold.yellow("Happy hacking with Vulcan!"));
  console.log(">  "+chalk.dim.yellow("The docs are available at: ")+chalk.redBright("http://docs.vulcanjs.org"));
}
