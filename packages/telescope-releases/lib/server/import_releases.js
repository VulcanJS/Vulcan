
importRelease = function (number) {
  if (!Releases.findOne({number: number})) {
    var releaseNotes = Assets.getText("releases/" + number + ".md");
    release = {
      number: number,
      notes: releaseNotes,
      createdAt: new Date(),
      read: false
    }
    Releases.insert(release);
  }
};

Meteor.startup(function () {
  importRelease('0.11.0');
  importRelease('0.11.1');
});