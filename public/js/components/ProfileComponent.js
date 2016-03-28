define(['knockout', 'knockout-postbox', 'text!templates/profile.html'],
	function (ko, koPostBox, template) {

		var instance = null;

		var ProfileViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var ProfileViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.isActive = ko.observable(false).subscribeTo('profileIsActive');
				_this.user = params.user;

				// methods
				_this.deactivateProfile = function(){
					_this.isActive(false);
				};

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

			if (!instance) {
				instance = new ProfileViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: ProfileViewModelFactory
			},
			template: template
		};

	}
);