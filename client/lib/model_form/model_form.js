var StringUtils = {
	humanize: function(string) {
		return this.capitalize(this.convertCamelToSpaces(string));
	},
	
	capitalize: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	convertCamelToSpaces: function(string) {
		return string.replace(/([A-Z])/g, function(match) {
			return ' ' + match;
		});
	}
}

var ModelForm = function (modelClass, formOptions) {
	this.modelClass = modelClass;
	this.formOptions = formOptions;
	
	this.generateFor = function (model) {
		this.model = model;
		
		$('#json-form').jsonForm({
		  schema: this.formSchema()
		});
	}
	
	this.formSchema = function() {
		var formSchema = {};
		
		for (var field in this.schema(this.model)) {
			formSchema[field] = {			
				type: this.option(field, 'type') || this.model[field].constructor.name.toLowerCase(),
				title: this.option(field, 'title') || StringUtils.humanize(field),
				id: field,
				default: this.model[field]
			}				

			if(this.option(field, 'enum')) formSchema[field]['enum'] = this.option(field, 'enum');
		}
		
		return formSchema;
	}	
	
	this.option = function(field, optionName) {
		if (formOptions[field]) return formOptions[field][optionName];
		return null;
	}
	
	this.submit = function (createHandler, updateHandler) {
		this.updateModelFromFormValues()
		
		if (this.model._id) {
			modelClass.update(this.model._id, {$set: this.schema(this.model)}, updateHandler);
	    } else {
	       this.model._id = modelClass.insert(this.schema(this.model), createHandler);   
	    }
	}
	
	this.updateModelFromFormValues = function() {
		for (field in this.schema(this.model)) {
			var regexExpression = ':regex(id, jsonform.*' + field + ')';
			var htmlElement = $(regexExpression);
			if (this.model[field].constructor == Boolean) this.model[field] = !!htmlElement.attr('checked');
			else this.model[field] = htmlElement.val();
		}
	}
	
	this.schema = function (model) {
		schema = {};
		for (field in model) {
			if (field != '_id') schema[field] = model[field];
		}
		return schema;
	}
}