define(['knockout', 'knockout-postbox', 'text!templates/profile.html'],
	function (ko, koPostBox, template) {

		var Profile = function (params) {
			if (!params) params = {};

			var _this = this;
			_this.socket = params.socket;

			// observables
			_this.user = params.user;

			// watch data changes
			_this.user().name.subscribe(function () {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			});

			_this.user().email.subscribe(function () {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			});

			_this.user().password.subscribe(function () {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			});

		};

		return {
			viewModel: Profile,
			template: template
		};

	}
);