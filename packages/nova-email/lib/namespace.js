/**
 * @summary Telescope Telescope.email namespace
 * @namespace Telescope.email
 */
Telescope.email = {};

Telescope.email.emails = {};

Telescope.email.addEmails = emails => {
  Telescope.email.emails = Object.assign(Telescope.email.emails, emails);
};