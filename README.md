Telescope is an open-source, real-time social news site built with [Meteor](http://meteor.com)

# Instalation
- Install Meteor
- Install [Meteorite](https://github.com/oortcloud/meteorite/)
- Run `mrt`

# Running Telescope on Heroku
- Use the [Heroku buildpack for Meteorite](https://github.com/oortcloud/heroku-buildpack-meteorite) to push to Heroku (if you get an error when pushign to Heroku, running `mrt update` before pushing again sometimes helps)
- `heroku config:add ROOT_URL=http://your_url`

# Setup
- Using the command line (`mrt mongo` or 'mrt mongo xyz.meteor.com' if you're deploying on Meteor), set a user to be an admin: `db.users.update({'_id':'user_id_here'}, {$set:{'isAdmin':true}})`