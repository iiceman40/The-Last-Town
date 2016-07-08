define(['underscore'], function (_) {
	var instance = null;

	var DataHelperService = function () {};

	/**
	 * @param {array} a  -> items
	 * @param {number} n -> number of chunks to create
	 * @param {boolean} balanced
	 * @returns {array}
	 */
	DataHelperService.prototype.chunkify = function(a, n, balanced) {
		if (n < 2) return [a];

		var len = a.length,
			out = [],
			i = 0,
			size;

		if (len % n === 0) {
			size = Math.floor(len / n);
			while (i < len) {
				out.push(a.slice(i, i += size));
			}
		}

		else if (balanced) {
			while (i < len) {
				size = Math.ceil((len - i) / n--);
				out.push(a.slice(i, i += size));
			}
		}

		else {
			n--;
			size = Math.floor(len / n);
			if (len % size === 0)
				size--;
			while (i < size * n) {
				out.push(a.slice(i, i += size));
			}
			out.push(a.slice(size * n));
		}

		return out;
	};

	return {
		getInstance: function () {
			if (!instance) {
				instance = new DataHelperService();
			}
			return instance;
		}
	};
});