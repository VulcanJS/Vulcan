IntercomInit=function() {
  var i=function(){i.c(arguments)};i.q=[];
  i.c=function(args){i.q.push(args)};window.Intercom=i;

  var s = document.createElement('script');
  s.type = 'text/javascript'; s.async = true;
  s.src = 'https://api.intercom.io/api/js/library.js';
  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(s, x);
};