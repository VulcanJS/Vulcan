import Telescope from 'meteor/nova:lib';
import PostsSubscribe from './components/PostsSubscribe.jsx';
import UsersSubscribe from './components/UsersSubscribe.jsx';
import PostsSubscribedList from './components/PostsSubscribedList.jsx';

Telescope.components.PostsSubscribe = PostsSubscribe;
Telescope.components.PostsSubscribedList = PostsSubscribedList;

Telescope.components.UsersSubscribe = UsersSubscribe;