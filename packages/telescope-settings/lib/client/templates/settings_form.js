AutoForm.addHooks(['updateSettingsForm', 'insertSettingsForm'], {
    onSuccess: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
    },

    onError: function(operation, result, template) {
      this.template.$('button[type=submit]').removeClass('loading');
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
