// A class that generates a form on the current page based on a FromModel object (see form_model.js)
var DatabaseForm = Class.extend({
	
	// Grab the form element from the DOM and add inputs to it based on the model object provided
	generateFor: function (model, formSelector) {
		this.model = model;
		this.formOptions = model.formOptions;
		
		$(formSelector).jsonForm({ schema: this.model.formSchema() });
	},
	
	// Read the values currently entered into the form and set them onto the model. Save the model to the database.
	submit: function (createHandler, updateHandler) {
		this.updateModelFromFormValues()
		this.model.save(createHandler, updateHandler)
	},
	
	updateModelFromFormValues: function() {
		for (field in this.model.schema) {
			var regexExpression = ':regex(id, jsonform.*' + field + ')';
			var htmlElement = $(regexExpression);
			if (this.model.schema[field].constructor == Boolean) this.model.schema[field] = !!htmlElement.attr('checked');
			else this.model.schema[field] = htmlElement.val();
		}
	}	
});