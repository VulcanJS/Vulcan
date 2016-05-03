import React from 'react';
import { Accounts } from 'meteor/std:accounts-ui';
import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

import Core from "meteor/nova:core";
const ModalTrigger = Core.ModalTrigger;

const PeggCardPostsPage = ({document, currentUser}) => {
  
  ({CommentsList, CommentsNew, PostsItem, PostsCategories, SocialShare, Vote, PostsStats, HeadTags, AccountsForm} = Telescope.components);

  const post = document;
  const htmlBody = {__html: post.htmlBody};
  const openLinkStyles = {
    position: 'relative',
    top: '-3px',
    height: '1em'
  };

  return (
    <div className="post-page">

      <HeadTags url={Posts.getLink(post)} title={post.title} image={post.thumbnailUrl} />
      
      <PostsItem post={post}/>

      <div className="post-body">{post.answer1}  &nbsp;&nbsp;
        { post.gif1 ?
          <a href={post.gif1} target='_blank'><img src="http://i.stack.imgur.com/To3El.png" style={ openLinkStyles }/></a>
          : ''
        }
      </div>
      <div className="post-body">{post.answer2}  &nbsp;&nbsp;
        { post.gif2 ?
          <a href={post.gif2} target='_blank'><img src="http://i.stack.imgur.com/To3El.png" style={ openLinkStyles }/></a>
          : ''
          }
      </div>
      <div className="post-body">{post.answer3}  &nbsp;&nbsp;
        { post.gif3 ?
          <a href={post.gif3} target='_blank'><img src="http://i.stack.imgur.com/To3El.png" style={ openLinkStyles }/></a>
          : ''
          }
      </div>
      <div className="post-body">{post.answer4}  &nbsp;&nbsp;
        { post.gif4 ?
          <a href={post.gif4} target='_blank'><img src="http://i.stack.imgur.com/To3El.png" style={ openLinkStyles }/></a>
          : ''
          }
      </div>

      {/*<SocialShare url={ Posts.getLink(post) } title={ post.title }/>*/}

      <div className="comments-thread">
        <h4 className="comments-thread-title">Comments</h4>
        <ListContainer 
          collection={Comments} 
          publication="comments.list" 
          selector={{postId: post._id}} 
          terms={{postId: post._id, view: "postComments"}} 
          limit={0}
          parentProperty="parentCommentId"
          joins={Comments.getJoins()}
          component={CommentsList}
        />

        { currentUser ?
          <div className="post-new-comment">
            <h4>New Comment:</h4>
            <CommentsNew type="comment" postId={post._id} />
          </div> :
          <div>
            <ModalTrigger size="small" component={<a>Please log in to comment</a>}>
              <AccountsForm/>
            </ModalTrigger>
          </div> }
      </div>

    </div>
  )
};

Telescope.components.PostsPage = PeggCardPostsPage;
