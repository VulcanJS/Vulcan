Telescope.utils.icons.upvote = "thumbs-up fa-2x";

Telescope.modules.remove('top', 'tagline_banner');

Telescope.modules.remove('secondaryNav', 'user_menu');

Telescope.modules.add('primaryNav', {
    template: 'user_menu',
    order: 1
});

Telescope.modules.remove('postComponents', 'post_discuss');

Telescope.modules.remove('postComponents', 'post_rank');
