/*

Utilities for displaying icons.

*/

import { Utils } from './utils.js';

// ------------------------------ Dynamic Icons ------------------------------ //

/**
 * @summary Take an icon name (such as "open") and return the HTML code to display the icon
 * @param {string} iconName - the name of the icon
 * @param {string} [iconClass] - an optional class to assign to the icon
 */
Utils.getIcon = function (iconName, iconClass) {
  var icons = Utils.icons;
  var iconCode = !!icons[iconName] ? icons[iconName] : iconName;
  iconClass = (typeof iconClass === 'string') ? ' '+iconClass : '';
  return '<i class="icon fa fa-fw fa-' + iconCode + ' icon-' + iconName + iconClass+ '" aria-hidden="true"></i>';
};

/**
 * @summary A directory of icon keys and icon codes
 */
Utils.icons = {
  expand: "angle-right",
  collapse: "angle-down",
  next: "angle-right",
  close: "times",
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
  search: "search",
  approve: "check-circle-o",
  reject: "times-circle-o",
  views: "eye",
  clicks: "mouse-pointer", 
  score: "line-chart",
  reply: "reply",
  spinner: "spinner",
  new: "plus",
  user: "user",
  like: "heart",
  image: "picture-o",
};
