"use strict";

var instance = null;

var MatrixService = function () {
	this.rng = null;
};

/**
 *
 * @param {Array} matrix
 * @param {{x: number, y: number}} position
 */
MatrixService.prototype.initMatrixPosition = function (matrix, position) {
	var x = position.x,
		y = position.y;

	if (!matrix[y]) {
		matrix[y] = {};
	}
	if (!matrix[y][x]) {
		matrix[y][x] = position;
	}
};

var getInstance = function(){
	if(!instance){
		instance = new MatrixService();
	}
	return instance;
};

exports.getInstance = getInstance;