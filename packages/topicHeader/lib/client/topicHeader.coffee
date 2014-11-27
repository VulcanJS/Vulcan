# this is only needed client side
postHeading.push
  template: 'topicHeader'
  position: 'aboveLarge'

topicData = new ReactiveVar()

Template.topicHeader.rendered = () ->
  if (isPost and hasCategory(this.data, 'topic') )
    Meteor.call('getTopicData', this.data, getTopicHeaderDataCB )


Template.topicHeader.helpers

  # only allow full screen posts to have a card
  isPost: () ->
    return isPost()

  isTopic: () ->
    return hasCategory(this, 'topic')

  isLesson: () ->
    return hasCategory(this, 'lesson')

  juicyData: () ->
    d = topicData.get()
    console.log("juicyData", d)
    d


# meteor method callback
# save data in the reactiveVar
# FIXME - this only works for one of this template instance at a time
# so breaks in the list view
getTopicHeaderDataCB = (err, res) ->
  if err
    console.error(err)
  else
    console.log("topic callback", res)
    topicData.set(res)

# FIXME - hacky way to avoid showing headers in the list view
# only show in 'posts' closeup mode
isPost = () ->
  url = Router.current().url
  flag = (url.indexOf("/posts") >= 0)
  console.log("isPost:", flag, url)
  return flag

hasCategory = (data, cat) ->
  res = _.where(data.categories, {name:cat})
  flag = (res.length > 0)
  return flag
