t=function(message){
  var d=new Date();
  console.log("### "+message+" rendered at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
}
nl2br= function(str) {   
var breakTag = '<br />';    
return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
getSetting = function(setting){
  var settings=Settings.find().fetch()[0];
  if(settings){
    return settings[setting];
  }
  return '';
}
getAuthorName = function(item){
  // keep both variables for transition period
  var id=item.userId || item.user_id;
  // if item is linked to a user, get that user's display name. Else, return the author field.
  return (id && (user=Meteor.users.findOne(id))) ? getDisplayName(user) : this.author;
}
scrollPageTo = function(selector){
  $('body').scrollTop($(selector).offset().top);  
}
getDigestURL = function(moment){
  return '/digest/'+moment.year()+'/'+(moment.month()+1)+'/'+moment.date()
}
getDateRange= function(pageNumber){
  var now = moment(new Date());
  var dayToDisplay=now.subtract('days', pageNumber-1);
  var range={};
  range.start = dayToDisplay.startOf('day').valueOf();
  range.end = dayToDisplay.endOf('day').valueOf();
  // console.log("after: ", dayToDisplay.startOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  // console.log("before: ", dayToDisplay.endOf('day').format("dddd, MMMM Do YYYY, h:mm:ss a"));
  return range;
}
cleanUp = function(s){
  return stripHTML(s);
}
stripHTML = function(s){
  return s.replace(/<(?:.|\n)*?>/gm, '');
}