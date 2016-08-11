import Telescope from 'meteor/nova:lib';
import Subscribe from './components/Subscribe.jsx';
import UsersSubscribe from './components/UsersSubscribe.jsx';
import SubscribedPosts from './components/SubscribedPosts.jsx';

Telescope.components.Subscribe = Subscribe;
Telescope.components.UsersSubscribe = UsersSubscribe;
Telescope.components.SubscribedPosts = SubscribedPosts;