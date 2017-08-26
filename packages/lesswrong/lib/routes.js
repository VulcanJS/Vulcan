import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'inbox', path: '/inbox', componentName: 'InboxWrapper' });
addRoute({ name: 'newPost', path: '/newPost', componentName: 'PostsNewForm' });
addRoute({ name: 'editPost', path: '/editPost', componentName: 'PostsEditForm' });
addRoute({ name: 'recentComments', path: '/recentComments', componentName: 'RecentCommentsPage' });

// Sequences
addRoute({ name: 'sequencesHome', path: '/library', componentName: 'SequencesHome' });
addRoute({ name: 'sequences', path: '/sequences/:_id', componentName: 'SequencesSingle' });
addRoute({ name: 'sequencesEdit', path: '/sequencesEdit/:_id', componentName: 'SequencesEditForm'});
addRoute({ name: 'sequencesNew', path: '/sequencesNew', componentName: 'SequencesNewForm'});


addRoute({ name: 'chaptersEdit', path: '/chaptersEdit/:_id', componentName: 'ChaptersEditForm'});

// Collections
addRoute({ name: 'collections', path: '/collections/:_id', componentName: 'CollectionsSingle' });
addRoute({ name: 'Sequences', path: '/sequences', componentName: 'CoreSequences'})
addRoute({ name: 'HPMOR', path: '/hpmor', componentName: 'HPMOR'})
addRoute({ name: 'Codex', path: '/codex', componentName: 'Codex'})


//Route for testing the editor. Useful for debugging
addRoute({ name: 'editorTest', path: '/editorTest', componentName: 'EditorTest' });
addRoute({ name: 'searchTest', path: '/searchTest', componentName: 'SearchBar'});
addRoute({ name: 'postsListEditorTest', path:'/postsListEditorTest', componentName: 'PostsListEditor'})
addRoute({ name: 'imageUploadTest', path: '/imageUpload', componentName: 'ImageUpload'});



addRoute({name:'posts.single',   path:'posts/:_id(/:slug)(/:commentId)', componentName: 'PostsSingle'})

addRoute({name: 'home', path: '/', componentName: 'Home'});
