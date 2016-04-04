define(['knockout', 'text!templates/games-list.html', 'GameViewModel', 'FlashMessageViewModel'],
	function (ko, template, GameViewModel, FlashMessageViewModel) {

		var instance = null;

		var GamesListViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var GamesListViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array
				_this.games = ko.observableArray([]);

				// observables
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				// computed observables

				// methods
				_this.createNewGame = function () {
					console.log('telling server to create new game');
					_this.socket.emit('createNewGame', {});
				};

				_this.joinGame = function(game){
					console.log('joining game', game);
					_this.currentGame(new GameViewModel(game));
				};

				_this.refreshGamesList = function () {
					console.log('requesting games list from server');
					_this.socket.emit('getGamesList', {});
				};

				// events
				_this.socket.on('gameCreated', function (data) {
					_this.games(data.games);
					console.log('a new game has been created', data);
				});

				_this.socket.on('gamesList', function (data) {
					_this.games(data.games);
					ko.postbox.publish('flashMessages', new FlashMessageViewModel(data.message));
					console.log('games list updated', data);
				});

				// init games list
				_this.refreshGamesList();
			};

			if (!instance) {
				instance = new GamesListViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: GamesListViewModelFactory
			},
			template: template
		};

	}
);