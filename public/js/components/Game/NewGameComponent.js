define(['knockout', 'text!templates/game/new.html', 'GameViewModel', 'FlashMessageViewModel'],
	function (ko, template, GameViewModel, FlashMessageViewModel) {

		var instance = null;

		var NewGameViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var NewGameViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array

				// observables
				_this.isActive = ko.observable(false).subscribeTo('newGameIsActive');
				_this.configNewGameIsActive = ko.observable(false);
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				_this.settings = {
					name: ko.observable(''),
					map: {
						width: ko.observable(12),
						height: ko.observable(10),
						seed: ko.observable('')
					}
				};

				// computed observables
				_this.validation = ko.computed(function(){
					return _this.settings.name() && _this.settings.map.width() > 0 && _this.settings.map.height() > 0;
				}, this);

				// methods
				_this.deactivateNewGame = function(){
					ko.postbox.publish("newGameIsActive", false);
					ko.postbox.publish("listGamesIsActive", false);
				};

				_this.backToList = function(){
					ko.postbox.publish("newGameIsActive", false);
					ko.postbox.publish("listGamesIsActive", true);
				};

				_this.configNewGame = function () {
					_this.configNewGameIsActive(true);
				};

				_this.createGame = function () {
					_this.socket.emit('createNewGame', ko.toJS(_this.settings));
					_this.backToList();
				};

			};

			if (!instance) {
				instance = new NewGameViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: NewGameViewModelFactory
			},
			template: template
		};

	}
);