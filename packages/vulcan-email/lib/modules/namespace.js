/**
 * @summary Vulcan VulcanEmail namespace
 * @namespace VulcanEmail
 */
export const VulcanEmail = {};

VulcanEmail.emails = {};

VulcanEmail.addEmails = emails => {
  // copy over "path" to "testPath" for backwards compatibility
  Object.keys(emails).forEach(key => {
    emails[key].testPath = emails[key].testPath || emails[key].path;
  });
  VulcanEmail.emails = Object.assign(VulcanEmail.emails, emails);
};

export default VulcanEmail;
