define(['knockout', 'text!templates/game/list.html', 'GameViewModel', 'FlashMessageViewModel'],
	function (ko, template, GameViewModel, FlashMessageViewModel) {

		var instance = null;

		var ListGamesViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var ListGamesViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observable array
				_this.games = ko.observableArray([]);

				// observables
				_this.isActive = ko.observable(true).subscribeTo('listGamesIsActive');
				_this.configNewGameIsActive = ko.observable(false);
				_this.user = params.user;
				_this.currentGame = params.currentGame;
				_this.connectedUsers = params.connectedUsers;

				// computed observables

				// methods
				_this.deactivateListGames = function(){
					ko.postbox.publish("listGamesIsActive", false);
				};

				_this.newGame = function () {
					_this.isActive(false);
					ko.postbox.publish("newGameIsActive", true);
				};

				_this.joinGame = function(game){
					_this.currentGame(new GameViewModel(game));
					// hide all panels
					ko.postbox.publish("gamesListIsActive", false);
					ko.postbox.publish("usersListIsActive", false);
					ko.postbox.publish("flashMessagesIsActive", false);
					ko.postbox.publish("chatIsActive", false);
				};

				_this.refreshGamesList = function () {
					_this.socket.emit('getGamesList', {});
				};

				_this.statusAsText = function(status) {
					switch(status) {
						case 1:
							return 'active';
					}
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
				instance = new ListGamesViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: ListGamesViewModelFactory
			},
			template: template
		};

	}
);