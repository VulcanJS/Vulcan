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

var Model = Class.extend({
	
	init: function(modelClass, options) {
		this.modelClass = modelClass;
		this.schema = this.blankSchema;
		this.formOptions = {};
		
		if (options) {
			this._id = options._id;
		
			for (field in this.schema) {
				if (options[field]) this.schema[field] = options[field];
			}
		}		
	},
	
	formSchema: function() {
		var formSchema = {};
		
		for (var field in this.schema) {
			formSchema[field] = {			
				type: this.option(field, 'type') || this.schema[field].constructor.name.toLowerCase(),
				title: this.option(field, 'title') || StringUtils.humanize(field),
				id: field,
				default: this.schema[field]
			}				

			if(this.option(field, 'enum')) formSchema[field]['enum'] = this.option(field, 'enum');
		}
		
		return formSchema;
	},	
	
	option: function(field, optionName) {
		if (this.formOptions[field]) return this.formOptions[field][optionName];
		return null;
	},
	
	overwriteTitle: function(field, title) {
		if (this.formOptions[field]) this.formOptions[field]['title'] = title;
		else this.formOptions[field] = { 'title': title };
	},
	
	overwriteType: function(field, type) {
		if (this.formOptions[field]) this.formOptions[field]['type'] = type;
		else this.formOptions[field] = { 'type': type }; 
	},
	
	makeSelect: function(field, options) {
		if (this.formOptions[field]) this.formOptions[field]['enum'] = options;
		else this.formOptions[field] = { 'enum': options };		
	},
	
	save: function(createHandler, updateHandler) {
		if (this._id) {
			this.modelClass.update(this._id, {$set: this.schema}, updateHandler);
	    } else {
	       this._id = this.modelClass.insert(this.schema, createHandler);   
	    }		
	}
});