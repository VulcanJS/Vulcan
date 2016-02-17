# Telescope Newsletter

This package schedules an automatic newsletter digest.

![Newsletter](http://f.cl.ly/items/0V0F351k1R1i3L1k1D0J/telescope-newsletter.png)

### Install

1. `mrt add telescope-newsletter`.
2. Go to the Telescope settings page and add your MailChimp API key and List ID. 

### Dependencies

- [meteor-mailchimp](https://github.com/MiroHibler/meteor-mailchimp/)
- [synced-cron](https://github.com/percolatestudio/meteor-synced-cron)
- [handlebars-server](https://github.com/EventedMind/meteor-handlebars-server)
- [meteor-npm](https://github.com/arunoda/meteor-npm/)

### Settings

- **Show Banner**: 
- **MailChimp API Key**: 
- **MailChimp List ID**: 
- **Newsletter Frequency**: Choose from every day, three times a week, and once a week. Note that changes to this setting require you to restart your app to take effect. 
- **Posts Per Newsletter**: how many posts each newsletter should contain. 

Note that for this package to work properly, you'll also need to fill in the **Default Email** setting. 

### How It Works

The package works with [MailChimp](http://mailchimp.com), which means you'll need to fill in an API key and List ID in your Telescope app's settings panel. 

Every `x` days, it builds a digest consisting of the top `y` items posted in the past `x` days that haven't yet been sent out in a newsletter. 

It then creates a campaign in MailChimp and schedules it to be sent out **one hour later**, and sends you a confirmation email (to give you some time to check that everything looks good).

### Test Routes

If you want to preview your email templates, you can do so at the following routes: 

- **Digest**: [http://localhost:3000/email/campaign](http://localhost:3000/email/campaign)
- **Confirmation**: [http://localhost:3000/email/digest-confirmation](http://localhost:3000/email/digest-confirmation)

(Replace `http://localhost:3000` with your app's URL)

### Newsletter Sign-Up Banner

This package also includes a newsletter sign-up banner that uses the MailChimp API to add people to your list. 

![Newsletter Banner](http://f.cl.ly/items/3k282w2b0I1U3y200944/telescope-newsletter-banner.png)