var ModelForm = Class.extend({
	
	generateFor: function (model, formSelector) {
		this.model = model;
		this.formOptions = model.formOptions;
		
		$(formSelector).jsonForm({ schema: this.model.formSchema() });
	},
	
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