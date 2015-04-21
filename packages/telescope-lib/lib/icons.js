// ------------------------------ Dynamic Icons ------------------------------ //

// take an icon name (such as "open") and return the HTML code to display the icon
getIcon = function (iconName, iconClass) {
  var iconCode = !!icons[iconName] ? icons[iconName] : iconName;
  var iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';
  return '<i class="icon fa fa-' + iconCode + ' icon-' + iconName + iconClass+ '" aria-hidden="true"></i>';
}

icons = {
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
}