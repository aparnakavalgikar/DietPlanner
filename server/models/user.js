var mongoose = require('mongoose');

//Create UserSchema
var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},	
	height: {
		type: String,
		required: false
	},
	weight: {
		type: String,
		required: false
	},	
	age: {
		type: String,
		required: false
	},
	gender: {
		type: String,
		required: false
	},	
	body: {
		type: String,
		required: false
	},	
	foodtype: {
		type: String,
		required: false
	},
	exhealth: {
		type: String,
		required: false
	},	
	goaltype: {
		type: String,
		required: false
	},
	goalweight: {
		type: String,
		required: false
	},
	isProfile: {
		type: String,
		required: true
	}

});

//Export the model schema
module.exports = UserSchema;