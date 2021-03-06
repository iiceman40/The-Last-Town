'use strict';

define(['knockout', 'moment'], function (ko, moment) {
	// MessageViewModel
	return function (data) {
		var _this = this;

		this.sender = ko.observable(data.sender);
		this.recipient = ko.observable(data.recipient);
		this.text = ko.observable(data.text || '');
		this.date = ko.observable(moment.isMoment(data.date) ? data.date : moment(data.date));

		this.formattedDate = ko.computed(function () {
			return _this.date() ? _this.date().format('YYYY-MM-DD') : '';
		}, this);

		this.formattedTime = ko.computed(function () {
			return _this.date() ? _this.date().format('HH:mm') : '';
		}, this);
	};
});