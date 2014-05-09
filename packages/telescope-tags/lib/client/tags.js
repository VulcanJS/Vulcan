preloadSubscriptions = typeof preloadSubscriptions === 'undefined' ? [] : preloadSubscriptions;
preloadSubscriptions.push('categories');

adminNav = typeof adminNav === 'undefined' ? [] : adminNav;
adminNav.push({
  route: 'categories',
  label: 'Categories'
});