# Telescope Digest Package

This package schedules an automatic newsletter digest.

### Dependencies

- [meteor-mailchimp](https://github.com/MiroHibler/meteor-mailchimp/)
- [synced-cron](https://github.com/percolatestudio/meteor-synced-cron)
- [handlebars-server](https://github.com/EventedMind/meteor-handlebars-server)

### Settings

- **Newsletter Frequency**: how often you want the digest to be sent, in days. Set to 0 to disable digest. Note that changes to this setting require you to restart your app to take effect. 
- **Posts Per Newsletter**: how many posts each newsletter should contain. 

### How It Works

The package works with [MailChimp](http://mailchimp.com), which means you'll need to fill in an API key and List ID in your Telescope app's settings panel. 

Every `x` days, it builds a digest consisting of the top `y` items posted in the past `x` days that haven't yet been sent out in a newsletter. 

It then creates a campaign in MailChimp and schedules it to be sent out **one hour later** (to give you some time to check that everything looks good).

### Test Routes

If you want to preview your email templates, you can do so at the following routes: 

- **Digest**: http://localhost:3000/email/campaign
- **Confirmation**: http://localhost:3000/email/digest-confirmation

(Replace `http://localhost:3000` with your app's URL)