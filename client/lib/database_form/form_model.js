// A utility class that we use in FormModel to set up a convention for the default labels for each form input field.
var StringUtils = {
	
	/* 
	Assumes that the argument is a camel-case string.
	It places spaces between each word and capitalizes the first letter. So, a string like "camelCase" becomes "Camel Case".
	*/
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


// A class that provides all the functionality required to generate a form from a database record.
var FormModel = Class.extend({
	
	/*
	Class constructor:
	collection: The MongoDB collection the record will be saved to.
	data: The record data if generating a form for an already-existing record. This argument is optional. 
	*/
	init: function(collection, data) {
		this.collection = collection;
		
		/*
		blankSchema is an object that each extending class must provide. 
		It contains all the fields to be saved to the database and their default values.
		The schema field holds the data to be saved to the database.
		*/
		this.schema = this.blankSchema;		
		
		// jsonform options that would override the defaults
		this.formOptions = {};
		
		this.load(data)
	},
	
	// If data has been provided in the constructor, load it into the current object
	load: function(data) {
		if (data) {
			this._id = data._id;
		
			for (field in this.schema) {
				if (data[field]) this.schema[field] = data[field];
			}
		}		
	},
	
	// Generate a jsonform schema for this object based on the form options given and conventions
	formSchema: function() {
		var formSchema = {};
		
		// Each field stored in the database is represented by a form input
		for (var field in this.schema) {
			
			formSchema[field] = {			
				// If type is already given in formOptions, use that, otherwise guess the input type by inspecting the field type
				type: this.option(field, 'type') || this.schema[field].constructor.name.toLowerCase(),
				
				// If the label text is already specified in formOptions, use that, otherwise use a humanized version of the field name (see StringUtils)
				title: this.option(field, 'title') || StringUtils.humanize(field),
				
				// Use the field name as an ID; jsonform will add a prefix to avoid name conflicts
				id: field,
				
				// Display the data in the input
				default: this.schema[field]
			}				

			// If an 'enum' option is provided in formOptions, turn the input into a select by adding the enum options to the jsonform schema
			if(this.option(field, 'enum')) formSchema[field]['enum'] = this.option(field, 'enum');
		}
		
		return formSchema;
	},	
	
	option: function(field, optionName) {
		if (this.formOptions[field]) return this.formOptions[field][optionName];
		return null;
	},
	
	// Overwrite the default label for a field by adding a 'title' entry to its form options
	overwriteTitle: function(field, title) {
		if (this.formOptions[field]) this.formOptions[field]['title'] = title;
		else this.formOptions[field] = { 'title': title };
	},
	
	// Overwrite the default type for a field by adding a 'type' entry to its form options
	overwriteType: function(field, type) {
		if (this.formOptions[field]) this.formOptions[field]['type'] = type;
		else this.formOptions[field] = { 'type': type }; 
	},
	
	// Make the input type of a string field be a select by editing formOptions appropriately
	makeSelect: function(field, options) {
		if (this.formOptions[field]) this.formOptions[field]['enum'] = options;
		else this.formOptions[field] = { 'enum': options };		
	},

	/*
	If the record was originally loaded from the database, update it. 
	Otherwise, create a new record with the appropriate data.
	
	createHandler, updateHandler: Functions to run after the database operations completes (such as displaying a message confirming things were saved properly). 
	These usually come from a DatabaseForm, which in turn gets them from a template helper.
	*/
	save: function(createHandler, updateHandler) {
		if (this._id) {
			this.collection.update(this._id, {$set: this.schema}, updateHandler);
	    } else {
	       this._id = this.collection.insert(this.schema, createHandler);   
	    }		
	}
});