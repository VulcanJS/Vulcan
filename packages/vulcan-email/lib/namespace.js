/**
 * @summary Telescope VulcanEmail namespace
 * @namespace VulcanEmail
 */
const VulcanEmail = {};

VulcanEmail.emails = {};

VulcanEmail.addEmails = emails => {
  VulcanEmail.emails = Object.assign(VulcanEmail.emails, emails);
};

export default VulcanEmail;