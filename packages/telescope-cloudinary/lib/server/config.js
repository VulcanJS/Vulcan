Cloudinary = Npm.require("cloudinary").v2;



Meteor.methods({
  testUpload: function () {

    // Cloudinary.config = {
    //   cloud_name: "telescope",
    //   api_key: "245566491779592",
    //   api_secret: "3tcjgv9Gir4lU6-GeI4M6Bd3hFM"
    // }
    
    Cloudinary.uploader.upload("http://bjjbot.com/bjjbot.png", {
      cloud_name: Settings.get("cloudinaryCloudName"),
      api_key: Settings.get("cloudinaryAPIKey"),
      api_secret: Settings.get("cloudinaryAPISecret")
    }, function(result, error) { 
      console.log(result) 
      console.log(error)
    });
  }
});