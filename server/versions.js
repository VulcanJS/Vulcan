registerVersion = function (number) {
  if (!Versions.findOne({number: number})) {
    var versionNotes = Assets.getText("versions/" + number + ".md");
    version = {
      number: number,
      notes: versionNotes,
      createdAt: new Date(),
      read: false
    }
    Versions.insert(version);
  }
};

Meteor.startup(function () {
  registerVersion('0.11.0');
  registerVersion('0.11.1');
});