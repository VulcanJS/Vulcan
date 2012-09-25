Proxino = {
  key:null,
  log:function(obj){
    if(typeof(obj) === "string"){
      obj = {type:"Message", body:obj}
    }
    if(obj.type === undefined || obj.body === undefined){
      throw "Make sure object meets form:{type:_,body:_}"
    }
    if(Proxino.key === null){
      throw "Please set your API key."
    }
    obj.key = Proxino.key;
    if(obj.url === undefined){
      var g_url;
      try{
        g_url = Proxino.get_url(obj.body);
      }
      catch(e){
        g_url = null;
      }
      if(g_url !== null && g_url.length > 0){
          obj.url = g_url[0];
      }
      else{
        obj.url = document.URL;
      }
    }
    try{
      $.ajax({
        url:"https://p.proxino.com/message",
        data:obj,
        dataType:"jsonp",
        success:function(data){
          //console.log(data);
        }
      }); 
    }
    catch(exc){
      // Ignore failure to post, don't want recursive loop
    }
  },
  track_errors:function(){
    if(Proxino.key === null){
      throw "Please set your API key."
    }
    window.onerror = function(msg, url, lineno){
      var data = {type:"Exception",body:msg}; 
      if(msg === undefined){
        data.body = "No message";
      }
      if(url !== undefined && url !== "undefined" && url !== ""){
        data.url = url;
      }
      if(lineno !== undefined && lineno !== 0){
        data.lineno = lineno;
      }
      //var body_str = msg + " at resource " + url + " in line " + lineno;
      Proxino.log(data);
    }
  },
  get_url:function(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex);
  }
}