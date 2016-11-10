define(['knockout', 'knockout-postbox', 'text!templates/debug.html', 'moment'],
	function (ko, koPostBox, template, moment, FlashMessageViewModel) {

		var instance = null;

		var DebugViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var DebugViewModel = function (params) {
				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.isActive = ko.observable(true).syncWith('debugIsActive');

				_this.worldTime = ko.observable(12).syncWith('worldTime');

				_this.deactivateDebug = function() {
					_this.isActive(false);
				}
			};

			if (!instance) {
				instance = new DebugViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: DebugViewModelFactory
			},
			template: template
		};

	}
);