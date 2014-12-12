generateUsername = (name) ->
  name.toLowerCase().replace /\s+|\s+/g, ""

findOrInsertUser = (fbUserData) ->
      # Check if there's already a user with this name
      user = Meteor.users.findOne
        username: generateUsername fbUserData.name
      # if so, use his id
      if user?
        postAuthorId = user._id
      # create new user and use this id (post author)
      else
        postAuthorId = Accounts.createUser
          username: generateUsername fbUserData.name
          password: 'letmein'
          profile:
            name: fbUserData.name
          fbData:
            id: fbUserData.id
      postAuthorId

checkIfNewPost = (fbPostId) ->
  post = Posts.findOne
  fbData:
    id: fbPostId
  if post? then false else true


Meteor.methods
  parseFacebookFeed: (jsonFeed) ->
    posts = EJSON.parse(jsonFeed).data
    for post in posts

      updatePost = false
      postAuthor = post.from
      postAuthorId = findOrInsertUser postAuthor

      postDoc =
        author: postAuthor.name
        body: post.message
        htmlBody: post.message
        status: 2
        upvotes: 0
        downvotes: 0
        commentCount: 0
        clickCount: 0
        viewCount: 0
        baseScore: 0
        score: 0
        inactive: false
        userId: postAuthorId
        createdAt: post.created_time
        postedAt: post.created_time
        fbData:
          id: post.id

      isNewPost = checkIfNewPost post.id

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
      postDbId = postDb._id

      if post.likes?
        updatePost = true
        postDoc = _.extend postDoc,
          upvotes: post.likes.data.length

      if post.comments?
        updatePost = true
        comments = post.comments.data
        postDoc = _.extend postDoc,
          commentCount: comments.length

        for comment in comments
          # @todo insert author
          commentAuthor = comment.from
          commentAuthorId = findOrInsertUser commentAuthor
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
            postId: postDbId
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

      # Update the post with given likes or comments data
      if updatePost is true
        Posts.update postDbId,
          $set: postDoc
        ,
          validate: false

      # Update the postCount of the post's author
      if isNewPost is true
        Meteor.users.update postAuthorId,
          $inc:
            postCount: 1

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
