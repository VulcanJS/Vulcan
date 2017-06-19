import { Accounts } from 'meteor/accounts-base';
import Users from 'meteor/vulcan:users';
import { getSetting } from 'meteor/vulcan:lib';

Accounts.emailTemplates.siteName = 'LessWrong 2.0';
Accounts.emailTemplates.from = 'LessWrong 2.0 <no-reply@lesserwrong.com>';
Accounts.emailTemplates.enrollAccount.subject = (user) => {
  return `Activate your Account on LessWrong 2.0`;
};
Accounts.emailTemplates.enrollAccount.text = (user, url) => {
  return 'You are invited to participate in the LessWrong 2.0 closed beta'
    + ' To register an account, simply click the link below:\n\n'
    + url;
};

Accounts.emailTemplates.resetPassword.subject = (user) => {
  return `Activate your Account on LessWrong 2.0`;
};

Accounts.emailTemplates.resetPassword.from = () => {
  // Overrides the value set in `Accounts.emailTemplates.from` when resetting
  // passwords.
  return 'LessWrong 2.0 <no-reply@lesserwrong.com>';
};

Accounts.emailTemplates.resetPassword.text = (user, url) => {
  return 'This is your invite to the LessWrong 2.0 closed beta. You should have received another email from us with more detailed instructions on how to participate in the beta. \n\n'
    + 'To activate your account, click on the link below. You can change your username on your profile page. \n \n'
    + url;
};
Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Activate your LessWrong 2.0 account";
   },
   text(user, url) {
      return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
   }
};

if (getSetting('mailUrl')) {
  console.log("Set Mail URL environment variable");
  process.env.MAIL_URL = getSetting('mailUrl');
  console.log("Set Root URL variable");
  process.env.ROOT_URL = "http://www.lesserwrong.com/";
};

let userId = Users.findOne({email: 'panisnecis+lesswrong@gmail.com'});
Accounts.sendResetPasswordEmail(userId);
