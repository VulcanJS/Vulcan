findOrInsertUser = (fbUserData) ->
      # Check if there's already a user with this name
      user = Meteor.users.findOne
        "fbData.id": fbUserData.id
      # if so, use his id
      console.log user
      if user?
        postAuthorId = user._id
      # create new user and use this id (post author)
      else
        postAuthorId = Accounts.createUser
          username: fbUserData.name.toLowerCase().replace /\s+|\s+/g, ""
          password: 'letmein'
          profile:
            name: fbUserData.name
          fbData:
            id: fbUserData.id
      postAuthorId

Meteor.methods
  parseFacebookFeed: (jsonFeed) ->
    posts = EJSON.parse(jsonFeed).data
    for post in posts

      postAuthorId = findOrInsertUser post.from

      postDoc =
        author: post.from.name
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
        fbData:
          id: post.id

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

      if post.likes?
        postDoc = _.extend postDoc,
          upvotes: post.likes.data.length

      # insert new post or update an old one
      postId = Posts.update
        fbData:
          id: post.id
      ,
        $set: postDoc
      ,
        upsert: true

      if post.comments?
        comments = post.comments.data
        postDoc = _.extend postDoc,
          commentCount: comments.length
        for comment in comments
          # @todo insert comment
          # @todo insert author
          commentDoc =
            author: comment.from.name
            body: comment.message
            createdAt: comment.created_time
            upvotes: comment.like_count
            fbData:
              id: comment.id
