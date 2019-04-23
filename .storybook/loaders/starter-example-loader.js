/**
 * 
 * Load the local Vulcan packages, inspired by vulcan-loader
 * 
 */
const { getOptions } = require('loader-utils');
module.exports = function loader(source) {
    const options = getOptions(this)

    const {  packagesDir, environment = 'client' } = options
    // prefixing your packages name makes it easier to write a loader
    const prefix = `${packagesDir}/example-`
    const defaultPath = `/lib/${environment}/main.js`

    const result = source.replace(
        // This regex will match:
        // meteor/example-{packageName}{some-optional-import-path}
        //
        // Example:
        // meteor/example-forum => match, packageName="forum"
        // meteor/example-forum/foobar.js => match, packageName="forum", importPath="/foobar.js"
        // meteor/another-package => do not match
        //
        // Explanation:
        // .+?(?=something) matches every char until "something" is met, excluding something
        // we use it to matche the package name, until we meet a ' or "
        /meteor\/example-(.*?(?=\/|'|"))(.*?(?=\'|\"))/g, // match Meteor packages that are lfg packages, + the import path (without the quotes)
        (match, packageName, importPath) => {
            console.log("Found Starter example package", packageName)
            if (importPath){
                return `${prefix}${packageName}${importPath}`
            }
            return `${prefix}${packageName}${defaultPath}`
        }
    )
    return result
}