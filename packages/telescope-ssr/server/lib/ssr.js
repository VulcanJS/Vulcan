function openGraphMetaProperties(post,protocol){
  protocol=protocol || "http";
  //
  if(post.thumbnailUrl.indexOf("//")===0){
    post.thumbnailUrl=protocol+":"+post.thumbnailUrl;
  }
  return {
    type:"article",
    url:Router.routes.post_page.url(post)+"/share",
    title:post.title,
    description:post.body,
    site_name:getSetting("title"),
    image:post.thumbnailUrl
  };
}

function twitterMetaProperties(post,protocol){
  protocol=protocol || "http";
  //
  if(post.thumbnailUrl.indexOf("//")===0){
    post.thumbnailUrl=protocol+":"+post.thumbnailUrl;
  }
  return {
    site:getSetting("twitterAccount"),
    title:post.title,
    description:post.body,
    image:post.thumbnailUrl,
    url:Router.routes.post_page.url(post)+"/share"
  };
}

var fs=Npm.require("fs");
var fsReadFileSync=Meteor.wrapAsync(fs.readFile,fs);

function addInlineCss(html){
  var cssName = _.find(Object.keys(WebAppInternals.staticFiles), function (fileName) {
    return /.css$/.test(fileName);
  });
  var cssPath = WebAppInternals.staticFiles[cssName].absolutePath;
  var css = fsReadFileSync(cssPath,{
    encoding: "utf8"
  });
  //
  return juice(html,{
    extraCss: css
  });
}

function postSharePageHandler(req, res, next) {
  var urlRegexp=/^\/posts\/(\w+)\/share\??/;
  var matches=req.url.match(urlRegexp);
  //
  if(!matches){
    next();
    return;
  }
  //
  var postId=matches?matches[1]:null;
  var post=Posts.findOne(postId);
  var protocol=req.headers["x-forwarded-proto"];
  var dataContext=_.extend(post,{
    og:openGraphMetaProperties(post,protocol),
    twitter:twitterMetaProperties(post,protocol),
    yield:"postSharePage"
  });
  //
  res.writeHead(200, {
    "Content-Type": "text/html; charset=UTF-8"
  });
  var html=SSR.render("main",dataContext);
  var htmlWithInlineCss=addInlineCss(html);
  res.end(htmlWithInlineCss);
}

WebApp.connectHandlers.stack.splice(1,0,{
  route:"",
  handle:postSharePageHandler
});
