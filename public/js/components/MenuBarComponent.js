define(['knockout', 'knockout-postbox', 'text!templates/menu-bar.html'],
	function (ko, koPostBox, template) {

		var instance = null;

		var MenuBarViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var MenuBarViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.user = params.user;

				_this.activateProfile = function(){
					ko.postbox.publish("profileIsActive", true);
				};

			};

			if (!instance) {
				instance = new MenuBarViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: MenuBarViewModelFactory
			},
			template: template
		};

	}
);