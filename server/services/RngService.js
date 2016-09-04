"use strict";

var seedrandom = require('seedrandom'),
	instance = null;

var RngService = function () {
	this.rng = null;
};

/**
 *
 * @param {number|string} seed
 */
RngService.prototype.init = function(seed){
	this.rng = seedrandom(seed);
};

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
RngService.prototype.randomInt = function(min, max){
	var _this = this;
	return min + Math.floor(_this.random() * (max - min));
};

/**
 * wrapper for possible logging when generating a random number
 * @returns {number}
 */
RngService.prototype.random = function() {
	return this.rng();
};

var getInstance = function(){
	if(!instance){
		instance = new RngService();
	}
	return instance;
};

exports.getInstance = getInstance;