'use strict';

var mongoose = require('mongoose');

// Schema
var MapSchema = mongoose.Schema({
	users:      {type: User, required: true},
	mapData:        {type: String, required: true}
});

// export model
module.exports = mongoose.model('Map', MapSchema);