// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.wondercount',
  name: 'WonderCount',
  description: 'Learning new things and find friends alike by answer some questions per day, every day.',
  author: 'Wonder Count',
  email: 'contact@wondercount.com',
  website: 'http://wondercount.com'
});

// Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'public/icons/ios/icon-60.png',
  'iphone_2x': 'public/icons/ios/appiconset/icon-60@2x.png',
  'iphone_3x' : 'public/icons/ios/appiconset/icon-60@3x.png',
  'ipad' : 'public/icons/ios/appiconset/icon-76.png',
  'ipad_2x' : 'public/icons/ios/appiconset/icon-76@2x.png',
  'android_ldpi' : 'public/icons/android/drawable-ldpi/ic_launcher.png',
  'android_mdpi' : 'public/icons/android/drawable-mdpi/ic_launcher.png',
  'android_hdpi' : 'public/icons/android/drawable-hdpi/ic_launcher.png',
  'android_xhdpi' : 'public/icons/android/drawable-xhdpi/ic_launcher.png'
  // ... more screen sizes and platforms ...
});

App.launchScreens({
  'iphone' : 'public/splash/Default.png',
  'iphone_2x' : 'public/splash/Default@2x.png',
  'iphone5' : 'public/splash/Default-568h@2x.png',
  'iphone6' : 'public/splash/Default-667h@2x.png',
  'iphone6p_portrait' : 'public/splash/Default-Portrait-736h@3x.png',
  'iphone6p_landscape' : 'public/splash/Default-Landscape-736h@3x.png',
  'ipad_portrait' : 'public/splash/Default-Portrait.png',
  'ipad_portrait_2x' : 'public/splash/Default-Portrait@2x.png',
  'ipad_landscape' : 'public/splash/Default-Landscape.png',
  'ipad_landscape_2x' : 'public/splash/Default-Landscape@2x.png',
  'android_ldpi_portrait' : 'public/splash/res-long-port-ldpi/default.png',
  'android_ldpi_landscape' : 'public/splash/res-long-land-ldpi/default.png',
  'android_mdpi_portrait' : 'public/splash/res-long-port-mdpi/default.png',
  'android_mdpi_landscape' : 'public/splash/res-long-land-mdpi/default.png',
  'android_hdpi_portrait' : 'public/splash/res-long-port-hdpi/default.png',
  'android_hdpi_landscape' : 'public/splash/res-long-land-hdpi/default.png',
  'android_xhdpi_portrait' : 'public/splash/res-long-port-xhdpi/default.png',
  'android_xhdpi_landscape' : 'public/splash/res-long-land-xhdpi/default.png'
  // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.phonegap.plugins.facebookconnect', {
  APP_ID: '916838861682301',
  API_KEY: '14bd57fefcbfa35800b0bf7f8ce78e26'
});