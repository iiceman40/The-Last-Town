define(['knockout', 'knockout-postbox', 'text!templates/menu-bar.html'],
	function (ko, koPostBox, template) {

		var instance = null;

		var MenuBarViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var MenuBarViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				_this.listGames = ko.observable(true).syncWith('listGamesIsActive');
				_this.newGame = ko.observable(false).syncWith('newGameIsActive');
				_this.debug = ko.observable(false).syncWith("debug", true);

				_this.mainMenuStructure = {
					'Panels': {
						'Messages': ko.observable().syncWith('flashMessagesIsActive'),
						'Users': ko.observable().syncWith('usersListIsActive'),
						'Games': ko.computed({
							read: function(){
								return _this.listGames() || _this.newGame();
							},
							write: function(state){
								_this.listGames(state);
								_this.newGame(false);
							}
						}),
						'Chat': ko.observable().syncWith('chatIsActive'),
						'Debug': ko.observable().syncWith('debugIsActive'),
						'---': false,
						'Close all': 'closeAllPanels'
					}
				};

				// observables
				_this.user = params.user;

				// methods
				_this.activateProfile = function(){
					ko.postbox.publish("profileIsActive", true);
				};

				_this.triggerMenuEntry = function(menuEntry) {
					if(typeof menuEntry === 'function') {
						// toggle menu entry if it is an observable with a boolean
						if(typeof menuEntry() === 'boolean') {
							menuEntry(!menuEntry());
						}
					} else if(typeof menuEntry == 'string') {
						// call function with the given name in this component
						_this[menuEntry]();
					}
				};

				_this.closeAllPanels = function(){
					var panels = _this.mainMenuStructure['Panels'];
					for(var entry in panels){
						if(panels.hasOwnProperty(entry)){
							if(typeof panels[entry] === 'function') {
								panels[entry](false);
							}
						}
					}
				};

				_this.toggleDebug = function(){
					_this.debug(!_this.debug());
					console.log('toggle debug', _this.debug());
				}

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