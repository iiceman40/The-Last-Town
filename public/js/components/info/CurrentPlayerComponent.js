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

				_this.currentGame.subscribe(function(game){
					console.log('currentGame changed', game);
					var players = game.players();
					for(var i = 0; i < players.length; i++) {
						var player = players[i];
						console.log(player.user(), _this.user()._id());
						if(player.user() === _this.user()._id()){
							_this.currentPlayer(player);
						}
					}
					console.log('currentPlayer', _this.currentPlayer());
				});

				console.log('DEBUG - Player View Model', _this.user(), _this.currentGame());

				_this.currentPlayer = ko.observable();

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