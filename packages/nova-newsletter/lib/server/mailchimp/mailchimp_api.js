// Mailchimp API wrapper (get rid of it eventually)
// see https://github.com/MiroHibler/meteor-mailchimp/blob/master/lib/server/mailchimp.js

import MailChimpNPM from 'mailchimp';

var getSettingsValueFor = function ( key ) {
    if (
      Meteor.settings &&
      Meteor.settings.private &&
      Meteor.settings.private.MailChimp
    ) {
      return Meteor.settings.private.MailChimp[ key ];
    }
  };

const MailChimp = function ( apiKey, options ) {
  var mailChimpOptions = {
      'apiKey' : apiKey || getSettingsValueFor( 'apiKey' ),
      'options': options || {
        'version': '2.0'  // Old, proven stuff... ;)
      }
    };

  if ( !mailChimpOptions.apiKey || mailChimpOptions.apiKey === '' ) {

    console.error( '[MailChimp] Error: No API Key defined!' );

    throw new Meteor.Error(
      'No API Key',
      'No API Key defined',
      'Define your API Key either in settings.json file or in a method call'
    );
  }

  this._asyncAPI = MailChimpNPM.MailChimpAPI(
    mailChimpOptions.apiKey,
    mailChimpOptions.options
  );
};

MailChimp.prototype.call = function ( section, method, options, callback ) {
  if ( callback && typeof callback === 'function' ) {
    // If anyone still wants to use old-fashioned callback method
    this._asyncAPI.call( section, method, options, callback );
  } else {
    try {
      var wrapped = Meteor.wrapAsync( this._asyncAPI.call, this._asyncAPI );

      return wrapped( section, method, options );
    } catch ( error ) {
      // A workaround for:
      // https://github.com/meteor/meteor/issues/2774
      if ( !error.error ) {
        throw new Meteor.Error( error.code, error.message );
      } else {
        throw new Meteor.Error( error );
      }
    }
  }
};

// Meteor.methods({
//   'MailChimp': function ( clientOptions, section, method, options ) {
//     check( clientOptions, Object );
//     check( section, String );
//     check( method, String );
//     check( options, Object );

//     var mailChimp,
//       mailChimpOptions = _.defaults( {}, options );

//     try {
//       mailChimp = new MailChimp( clientOptions.apiKey, clientOptions.options );
//     } catch ( error ) {
//       throw new Meteor.Error( error.error, error.reason, error.details );
//     }

//     switch ( section ) {
//       case 'lists':
//         if ( !mailChimpOptions.id || mailChimpOptions.id === '' ) {
//           mailChimpOptions.id = getSettingsValueFor( 'listId' );
//         }

//         break;
//       default:
//     }

//     return mailChimp.call( section, method, mailChimpOptions );
//   }
// });

export default MailChimp;