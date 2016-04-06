'use strict';

var mongoose = require('mongoose');

// Schema
var PlayerSchema = mongoose.Schema({
	user:       {type: User, required: true},
	map:        {type: Object, required: true}
});

// export model
module.exports = mongoose.model('Player', PlayerSchema);