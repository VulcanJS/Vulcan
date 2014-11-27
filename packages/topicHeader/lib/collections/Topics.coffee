TopicSchema = new SimpleSchema
  _id:
    type: String,
    optional: true

  cname:
    type: String

  title:
    type: String
    optional: true

  subtitle:
    type: String
    optional: true


Topics = new Meteor.Collection("topics")
Topics.attachSchema(TopicSchema)



Meteor.startup ->
  if Meteor.isServer

    testdata = [
      {
        cname: "ageku"
        title: "ageku"
        subtitle: "after a long time"
      }
      {
        cname: "yatto"
        title: "yatto"
        subtitle: "at last"
      }
    ]

    _.each testdata, (item) ->
      Topics.insert(item)
