AutoForm.hooks({
  updateSettingsForm: {

    before: {
      update: function(docId, modifier, template) {
        template.$('button[type=submit]').addClass('loading');
        return modifier;
      }
    },

    onSuccess: function(operation, result, template) {
      template.$('button[type=submit]').removeClass('loading');
    },

    onError: function(operation, result, template) {
      template.$('button[type=submit]').removeClass('loading');
    }

  },
  insertSettingsForm: {

    before: {
      insert: function(doc, template) {
        template.$('button[type=submit]').addClass('loading');
        return doc;
      }
    },

    onSuccess: function(operation, result, template) {
      template.$('button[type=submit]').removeClass('loading');
    },

    onError: function(operation, result, template) {
      template.$('button[type=submit]').removeClass('loading');
    }

  }
});