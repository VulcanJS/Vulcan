Telescope is an open-source, real-time social news site built with [Meteor](http://meteor.com)

**Note:** Telescope is beta software. Most of it should work but it's still a little unpolished and you'll probably find some bugs. Use at your own risk :)

# Learn More
- [Telescope Site](http://telesc.pe)
- [Telescope Demo](http://demo.telesc.pe)

# Features
- Real-time (of course!)
- Password-based and/or Twitter auth
- Notifications
- Mobile-ready & responsive
- Invite-only access for reading and/or posting
- Markdown support
- Day by day view

# Installation
- Install Meteor
- Install [Meteorite](https://github.com/oortcloud/meteorite/)
- Download or clone Telescope into /some/path
- cd /some/path
- Run `mrt`

# Running Telescope on Heroku
- Use the [Heroku buildpack for Meteorite](https://github.com/oortcloud/heroku-buildpack-meteorite) to push to Heroku: `heroku create --stack cedar --buildpack https://github.com/oortcloud/heroku-buildpack-meteorite.git`
- Add MongoHQ addon

# First Run
- Set the root URL variable used for Twitter auth (on Heroku: `heroku config:add ROOT_URL=http://your_url`)
- Fill in your Twitter keys
- The first user account created will automatically be made admin
- Check out the settings page and fill out basic things like the site's name