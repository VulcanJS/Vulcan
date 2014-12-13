generateUsername = (name) ->
  name.toLowerCase().replace /\s+|\s+/g, ""

findUserByFbId = (fbId) ->
  Meteor.users.findOne
    "fbData.id": fbId

findOrInsertUser = (fbUserData) ->
      isNewUser = false
      # Check if there's already a user with this name
      user = findUserByFbId fbUserData.id
      # if so, use his existing id
      if user?
        userId = user._id
      # create new user and use this id (post author)
      else
        isNewUser = true
        username = generateUsername fbUserData.name
        userId = Accounts.createUser
          username: username
          email: "#{username}@massivites.io"
          password: 'letmein'
          profile:
            name: fbUserData.name
          fbData:
            id: fbUserData.id
            name: fbUserData.name
      userId: userId
      isNewUser: isNewUser

checkIfNewPost = (fbPostId) ->
  post = Posts.findOne 'fbData.id': fbPostId
  if post? then false else true

Meteor.methods
  parseFacebookFeed: (jsonFeed) ->
    parserStats =
      updatedPosts: 0
      newPosts: 0
      newUsers: 0
      updatedUsers: 0
      changedComments: 0
    posts = EJSON.parse(jsonFeed).data

    for post in posts

      # Break the loop and go to the next post if there is no message
      break if not post.message?

      console.log "================ Facebook post id: #{post.id} ================"

      isNewPost = checkIfNewPost post.id
      postAuthor = post.from
      postAuthorId = (findOrInsertUser postAuthor).userId
      postLikes = if post.likes? then post.likes.data.length else 0

      postDoc =
        author: postAuthor.name
        body: post.message
        htmlBody: post.message
        status: 2
        upvotes: postLikes
        baseScore: postLikes
        downvotes: 0
        commentCount: 0
        clickCount: 0
        viewCount: 0
        score: 0
        inactive: false
        userId: postAuthorId
        createdAt: post.created_time
        postedAt: post.created_time
        fbData:
          id: post.id

      # insert new post or update an old one
      Posts.update
        fbData:
          id: post.id
      ,
        $set: postDoc
      ,
        upsert: true

      postDb = Posts.findOne
        fbData:
            id: post.id

      if post.comments?
        comments = post.comments.data
        parserStats.changedComments = comments.length
        # update the post's comment count
        Posts.update postDb._id,
          $set:
            commentCount: comments.length
        ,
          validate: false

        for comment in comments
          # @todo insert author
          commentAuthor = comment.from
          user = findOrInsertUser commentAuthor
          commentAuthorId = user.userId
          if user.isNewUser then parserStats.newUsers +=1 else parserStats.updatedUsers +=1
          # @todo insert comment
          commentDoc =
            upvotes: comment.like_count
            downvotes: 0
            baseScore: 0
            score: 0
            author: commentAuthor.name
            body: comment.message
            htmlBody: comment.message
            createdAt: comment.created_time
            postedAt: comment.created_time
            upvotes: comment.like_count
            postId: postDb._id
            userId: commentAuthorId
            fbData:
              id: comment.id
          # insert new post or update an old one
          Comments.update
            fbData:
              id: comment.id
          ,
            $set: commentDoc
          ,
            validate: false
            upsert: true

      # if it's a new post, update the postCount of the author
      if isNewPost is true
        parserStats.newPosts += 1
        Meteor.users.update postAuthorId,
          $inc:
            postCount: 1

      parserStats.updatedPosts +=1

    parserStats

      # @todo check whether this actually works
      # if post.place?
      #   place = post.place
      #   postDoc = _.extend postDoc.fbData,
      #     place:
      #       id: place.id
      #       name: place.name
      #       location:
      #         city: place.city
      #         country: place.country
      #         latitude: place.latitude
      #         longitude: place.longitude
      #         street: place.street
