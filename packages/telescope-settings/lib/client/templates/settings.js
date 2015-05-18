AutoForm.addHooks(['updateSettingsForm', 'insertSettingsForm'], {
    onSuccess: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(i18n.t('settings_saved'), 'success');
      Messages.clearSeen();
      $('body').scrollTop(0);
    },

    onError: function(operation, error) {
      this.template.$('button[type=submit]').removeClass('loading');
      Messages.flash(error, 'error');
      Messages.clearSeen();
      $('body').scrollTop(0);
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
