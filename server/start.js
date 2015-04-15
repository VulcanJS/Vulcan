Meteor.startup(function () {
  logEvent({
    name: "firstRun",
    unique: true, // will only get logged a single time
    important: true
  });

  // Categories = new Mongo.Collection('categories');
  Categories.remove({});

  Categories.insert({'name' : 'Arts & Entertainment',
  'description' : 'Movies, Music, Celbs',
  'order' : 1,
  'slug' : 'arts_&_entertainment',
  'image' : null
  });

  Categories.insert({'name' : 'Health & Fitness',
  'description' : 'Get Lean. Get Pumped',
  'order' : 2,
  'slug' : 'beauty_&_fitness',
  'image' : null
  });

  Categories.insert({'name' : 'Games',
  'description' : 'Game away',
  'order' : 1,
  'slug' : 'games',
  'image' : null
  });

  Categories.insert({'name' : 'News',
  'description' : 'World. Political. Serious Stuff',
  'order' : 1,
  'slug' : 'news',
  'image' : null
  });

  Categories.insert({'name' : 'Sports',
  'description' : 'Bro Time Sports',
  'order' : 1,
  'slug' : 'sports',
  'image' : null
  });

  Categories.insert({'name' : 'Travel',
  'description' : 'Go Places',
  'order' : 8,
  'slug' : 'travel',
  'image' : null
  });

});

if (Settings.get('mailUrl'))
  process.env.MAIL_URL = Settings.get('mailUrl');
