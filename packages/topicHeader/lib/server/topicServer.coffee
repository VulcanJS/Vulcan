Meteor.methods
  getTopicData: (data) ->
    query = {title: data.title}
    topic = Topics.findOne(query)
    console.log("getTopicData:", query)
    console.log("found:", topic)
    return topic