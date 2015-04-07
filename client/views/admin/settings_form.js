AutoForm.hooks({
  updateSettingsForm: {

    before: {
      update: function(modifier) {
        this.template.$('button[type=submit]').addClass('loading');
        return modifier;
      }
    },

    onSuccess: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
    },

    onError: function(operation, result, template) {
      this.template.$('button[type=submit]').removeClass('loading');
    }

  },
  insertSettingsForm: {

    before: {
      insert: function(doc) {
        this.template.$('button[type=submit]').addClass('loading');
        return doc;
      }
    },

    onSuccess: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
    },

    onError: function(operation, result) {
      this.template.$('button[type=submit]').removeClass('loading');
    }

  }
});