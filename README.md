Telescope is an open-source, real-time social news site built with [Meteor](http://meteor.com)

**Note:** Telescope is beta software. Most of it should work but it's still a little unpolished and you'll probably find some bugs. Use at your own risk :)

# Learn More
- [Telescope Site](http://telesc.pe)
- [Telescope Demo](http://demo.telesc.pe)
- [Telescope Meta](http://meta.telesc.pe/) – Discussions about Telescope
- [Telescope Wiki](https://github.com/SachaG/Telescope/wiki)

# License
- Telescope is distributed under the [MIT License](http://opensource.org/licenses/MIT)

# Features
- Real-time (of course!)
- Password-based and/or Twitter auth
- Notifications
- Mobile-ready & responsive
- Invite-only access for reading and/or posting
- Markdown support
- Day by day view

# Installation
- Install [Meteor](http://meteor.com)
- Install [Meteorite](https://github.com/oortcloud/meteorite/)
- Download or clone Telescope into /some/path
- cd /some/path
- Run `mrt`

# Developing on Nitrous.IO

Start hacking on this app on
[Nitrous.IO](https://www.nitrous.io/?utm_source=github.com&utm_campaign=Telescope&utm_medium=hackonnitrous)
in seconds:

[![Hack TelescopeJS/Telescope on Nitrous.IO](https://d3o0mnbgv6k92a.cloudfront.net/assets/hack-l-v1-3cc067e71372f6045e1949af9d96095b.png)](https://www.nitrous.io/hack_button?source=embed&runtime=nodejs&repo=TelescopeJS%2FTelescope&file_to_open=README.nitrous.md)

# Hosting Telescope

I recommend using either Meteor's own free hosting service, or checking out [Modulus](http://modulus.io/). 

# First Run
- Fill in your Twitter keys (by clicking on "Sign Up/Sign in" in your Telescope top bar)
- The first user account created will automatically be made admin
- Check out the settings page and fill out basic things like the site's name

# Local Variables
Meteor uses local environment variables for a few things, such as configuring email. While some platforms (like Modulus) make it easy to configure them from their web dashboard, on a local dev environment the best way is to set up an alias for the `mrt` command. 
For example, to configure Meteor to use Mailgun for email, in your `.bash_profile` file just add:
`alias m='MAIL_URL=smtp://username:password@smtp.mailgun.org:587/ mrt'`

This can also be useful for starting Meteor on a specific port:
`alias m4='MAIL_URL=smtp://username:password@smtp.mailgun.org:587/ mrt --port 4000'`