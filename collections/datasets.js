datasetSchemaObject = {
  _id: {
    type: String,
    optional: true
  },
  cancerStudyId: {
    type: String,
  	optional: false,
	unique: true
  },
  
  typeOfCancerId: {
    type: String,
    optional: false
  },
  title: {
    type: String,
    optional: false
  },
  shortName: {
    type: String,
    optional: false
  },
  description: {
    type: String,
    optional: false
  },
  groups: {
    type: [String],
    optional: true
  },
  pmid: {
  	type: String,
	optional: true
  },
  citation: {
  	type: String,
	optional: true
  },
  status: {
    type: Number,
    optional: true
  },
  inactive: {
    type: Boolean,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  updateAt: {
    type: Date,
    optional: true
  },    
  userId: {
    type: String, // XXX
    optional: true
  }
};


Datasets = new Meteor.Collection("datasets");

DatasetSchema = new SimpleSchema(datasetSchemaObject);
Datasets.attachSchema(DatasetSchema);

//Datasets.insert({title: "WCDT CRPC Prostate Mets", shortName: "WCDT Prostate", description: "WCDT CRPC Prostate Mets", cancerStudyId: "prad_wcdt", typeOfCancerId: "PRAD"}, function(error, result) {
//	if(!result) 
//		console.log("error inserting dataset "+error);
//});
	
STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

Datasets.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'title', 'citation', 'pmid', 'shortName').length > 0);
  }
});

Datasets.allow({
  update: canEditById,
  remove: canEditById
});

clickedDatasets = [];

