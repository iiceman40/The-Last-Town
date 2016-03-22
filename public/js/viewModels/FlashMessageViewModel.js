'use strict';

define(['knockout', 'moment'], function(ko, moment) {
	// FlashMessageViewModel
	return function (data) {
		this.MESSAGE_TYPE_DEFAULT = 'info';

		var _this = this;

		_this.text = ko.observable(data.text || '');
		_this.type = ko.observable(data.type || 'info');
		_this.isVisible = ko.observable(true);

		this.date = ko.observable(moment.isMoment(data.date) ? data.date : moment(data.date));

		this.formattedDateTime = ko.computed(function () {
			return _this.date() ? _this.date().format('YYYY-MM-DD - HH:mm') : '';
		}, this);

	};
});