var importRelease = function (number) {
  var releaseNotes = Assets.getText("releases/" + number + ".md");

  if (!Releases.findOne({number: number})) {

    var release = {
      number: number,
      notes: releaseNotes,
      createdAt: new Date(),
      read: false
    };
    Releases.insert(release);

  } else {

    // if release note already exists, update its content in case it's been updated
    Releases.update({number: number}, {$set: {notes: releaseNotes}});

  }
};

Meteor.startup(function () {

  importRelease('0.25.5');

  // if this is before the first run, mark all release notes as read to avoid showing them
  if (!Events.findOne({name: 'firstRun'})) {
    Releases.update({}, {$set: {read: true}}, {multi: true});
  }

});
