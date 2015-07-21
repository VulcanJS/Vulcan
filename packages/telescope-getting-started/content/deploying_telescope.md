### Quick Deploy

Once you've played around with Telescope, you might want to deploy your app for the whole world to see. 

You can do so easily using Meteor's own free hosting service. Just open a terminal window, go to your Telescope app's directory, and type:

```
meteor deploy my-app
```

Where `my-app` is a unique name you'll pick for your Telescope app. It will then be deployed to `http://my-app.meteor.com`. 

You might need to create a Meteor account first. Just follow the instructions!

Note that deploying does *not* copy over your database, which contains your posts and settings. So you'll need to configure them separately on your remote Telescope instance.

### Deploying For Production

Hosting on `*.meteor.com` is fine for small apps and prototypes, but if you want to deploy your app in production you'll need something better. 

Check out [the Telescope documentation](http://docs.telescopeapp.org/docs/deploying) to learn more about this topic.