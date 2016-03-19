'use strict';

var mongoose = require('mongoose');

// TODO add password hashing
// Schema
var UserSchema = mongoose.Schema({
	name:       {type: String, required: true, index: {unique: true}},
	password:   {type: String, required: true},
	email:      {type: String}
});

// export model
module.exports = mongoose.model('User', UserSchema);