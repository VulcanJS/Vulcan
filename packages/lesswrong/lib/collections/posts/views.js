import Posts from 'meteor/vulcan:posts';

/**
 * @summary Draft view
 */
Posts.addView("draft", terms => {
  console.log("userId", terms.userId);
  return {
    selector: {
      userId: terms.userId,
      draft: true
    },
    options: {
      sort: {createdAt: -1}
    }
}});

/**
 * @summary All drafts view
 */
Posts.addView("all_draft", terms => ({
  selector: {
    draft: true
  },
  options: {
    sort: {createdAt: -1}
  }
}));
