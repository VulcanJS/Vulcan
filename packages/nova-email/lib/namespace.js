/**
 * @summary Telescope NovaEmail namespace
 * @namespace NovaEmail
 */
const NovaEmail = {};

NovaEmail.emails = {};

NovaEmail.addEmails = emails => {
  NovaEmail.emails = Object.assign(NovaEmail.emails, emails);
};

export default NovaEmail;