// ------------------------------ Dynamic Icons ------------------------------ //

/**
 * Take an icon name (such as "open") and return the HTML code to display the icon
 * @param {string} iconName - the name of the icon
 * @param {string} [iconClass] - an optional class to assign to the icon
 */
Telescope.utils.getIcon = function (iconName, iconClass) {
  var icons = Telescope.utils.icons;
  var iconCode = !!icons[iconName] ? icons[iconName] : iconName;
  var iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';
  return '<i class="icon fa fa-' + iconCode + ' icon-' + iconName + iconClass+ '" aria-hidden="true"></i>';
};

/**
 * A directory of icon keys and icon codes
 */
Telescope.utils.icons = {
  open: "plus",
  close: "minus",
  upvote: "chevron-up",
  voted: "check",
  downvote: "chevron-down",
  facebook: "facebook-square",
  twitter: "twitter",
  googleplus: "google-plus",
  linkedin: "linkedin-square",
  comment: "comment-o",
  share: "share-square-o",
  more: "ellipsis-h",
  menu: "bars",
  subscribe: "envelope-o",
  delete: "trash-o",
  edit: "pencil",
  popularity: "fire",
  time: "clock-o",
  best: "star",
  search: "search"
};
