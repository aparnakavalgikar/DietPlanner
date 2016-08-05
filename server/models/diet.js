var mongoose = require('mongoose');

//Create UserSchema
var DietSchema = new mongoose.Schema({
	foodtype: {
		type: String,
		require: true
	},
	goaltype: {
		type: String,
		require: true
	},
	breakfast: {
		food: {
			type: String,
			required: true
		},	
		serving: {
			type: String,
			required: true
		},	
		cal: {
			type: String,
			required: true
		}
	},
	lunch: {
		food: {
			type: String,
			required: true
		},	
		serving: {
			type: String,
			required: true
		},	
		cal: {
			type: String,
			required: true
		}
	},	
	snacks: {
		food: {
			type: String,
			required: true
		},	
		serving: {
			type: String,
			required: true
		},	
		cal: {
			type: String,
			required: true
		}
	},
	dinner: {
		food: {
			type: String,
			required: true
		},	
		serving: {
			type: String,
			required: true
		},	
		cal: {
			type: String,
			required: true
		}
	}
});

//Export the model schema
module.exports = DietSchema;