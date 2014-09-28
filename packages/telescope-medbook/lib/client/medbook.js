templates["posts_list"] = "MedBookMainPage";

// use this instead of Jquery ready() function.
Template[getTemplate('posts_list')].rendered = function(){
    $(document).ready(function() { $( "#tabs" ).tabs(); });
}
