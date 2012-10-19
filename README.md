Telescope is an open-source, real-time social news site built with [Meteor](http://meteor.com)

**Note:** Telescope is beta software. Most of it should work but it's still a little unpolished and you'll probably find some bugs. Use at your own risk :)

# Features
- Real-time (of course!)
- Password and/or Twitter auth
- Notifications
- Mobile-ready & responsive
- Invite-only access
- Markdown support
- Day by day view

# Instalation
- Install Meteor
- Install [Meteorite](https://github.com/oortcloud/meteorite/)
- Run `mrt`

# Running Telescope on Heroku
- Use the [Heroku buildpack for Meteorite](https://github.com/oortcloud/heroku-buildpack-meteorite) to push to Heroku
- `heroku config:add ROOT_URL=http://your_url`