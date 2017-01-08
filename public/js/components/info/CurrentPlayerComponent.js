define([
		'knockout', 'text!templates/info/current-player.html', 'PlayerViewModel', 'FlashMessageViewModel', 'BabylonComponent'
	],
	function (ko, template, PlayerViewModel, FlashMessageViewModel, BabylonComponent) {

		var instance = null;

		var CurrentPlayerViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var CurrentPlayerViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array

				// observables
				_this.isActive = ko.observable(false).subscribeTo('selectedTileIsActive');
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				_this.babylonViewModel = BabylonComponent.viewModel.createViewModel();
				_this.scene = _this.babylonViewModel.scene;

				_this.currentPlayer = ko.observable();

				_this.currentGame.subscribe(function(game){
					console.log('currentGame changed', game);
					console.log('userId', _this.user()._id());
					var _myPlayer = game.getPlayerByUserId(_this.user()._id());
					console.log(_myPlayer);
					_this.currentPlayer(_myPlayer);
					_this.babylonViewModel.myPlayer = _this.currentPlayer;
					console.log('currentPlayer', _this.currentPlayer());
				});

				console.log('DEBUG - Player View Model', _this.user(), _this.currentGame());

				/**
				 *
				 */
				_this.goToTile = function() {
					console.log('TODO - impelment moving to tile step by step');
				}

			};

			if (!instance) {
				instance = new CurrentPlayerViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: CurrentPlayerViewModelFactory
			},
			template: template
		};

	}
);