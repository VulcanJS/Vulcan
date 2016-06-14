// import Messages from "./messages.js";

// FlowRouter.extendPathWithQueryParams = (path, params, newQueryParams) => {
//   const current = FlowRouter.current();
//   const currentQueryParams = _.clone(current.queryParams);
//   return FlowRouter.path(path, params, _.extend(currentQueryParams, newQueryParams));
// };

// FlowRouter.triggers.exit([() => Messages.clearSeen()]);

// FlowRouter.addToQueryArray = function (key, value) {
//   var keyArray = FlowRouter.getQueryParam(key) || [];
//   keyArray.push(value);
//   var params = {};
//   params[key] = keyArray;
//   FlowRouter.setQueryParams(params);
// }

// FlowRouter.removeFromQueryArray = function (key, value) {
//   var keyArray = FlowRouter.getQueryParam(key);
//   keyArray = _.without(keyArray, value);
//   var params = {};
//   params[key] = keyArray;
//   FlowRouter.setQueryParams(params);
// }

// if(Meteor.isServer) {
//   var timeInMillis = 1000 * 30; // 30 secs
//   FlowRouter.setPageCacheTimeout(timeInMillis);
//   FlowRouter.setDeferScriptLoading(true);
// }

// // FlowRouter.notFound = {
// //   action: function() {
// //     if (Meteor.isClient) {
// //       DocHead.addMeta({
// //         name: "name",
// //         property: "prerender-status-code",
// //         content: "404"
// //       });
// //       DocHead.addMeta({
// //         name: "name",
// //         property: "robots",
// //         content: "noindex, nofollow"
// //       });
// //     }
// //     BlazeLayout.render("layout", {main: "not_found"});
// //   }
// // };

// if (typeof Events !== "undefined" && Meteor.isClient) {
//   FlowRouter.triggers.enter([function () {Events.analyticsRequest()}]);
// }
