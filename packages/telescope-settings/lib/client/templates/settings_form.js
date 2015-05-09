AutoForm.addHooks(['updateSettingsForm', 'insertSettingsForm'], {
    onSuccess: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(i18n.t('Settings Saved'), 'success');//i18n string !!
      Messages.clearSeen();
      $('body').scrollTop(0);
      $('.success-message.module').fadeOut( 5000,"swing" );
    },

    onError: function(operation, result, template) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(i18n.t('You have an error please correct the fields'), 'error');//i18n string !!
      Messages.clearSeen();
      $('.error.error-message.module').fadeOut( 5000,"swing" );
    }
});

AutoForm.hooks({
  updateSettingsForm: {
    before: {
      update: function(modifier) {
        this.template.$('button[type=submit]').addClass('loading');
        return modifier;
      }
    }

  },
  insertSettingsForm: {
    before: {
      insert: function(doc) {
        this.template.$('button[type=submit]').addClass('loading');
        return doc;
      }
    }
  }
});
