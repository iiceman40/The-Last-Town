define(['knockout', 'knockout-postbox', 'text!templates/login.html', 'FlashMessageViewModel'],
	function (ko, koPostBox, template, FlashMessageViewModel) {

		var instance = null;

		var LoginViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var LoginViewModel = function (params) {
				if (!params) params = {};

				var _this = this;
				_this.socket = params.socket;

				// observables
				_this.user = params.user;

				// methods
				_this.signIn = function () {
					console.log('trying to sign in', _this.socket, ko.toJS(_this.user));
					_this.socket.emit('signIn', ko.toJS(_this.user));
					return true;
				};

				_this.signOut = function () {
					_this.socket.emit('signOut', ko.toJS(_this.user));
				};

				_this.signUp = function () {
					_this.socket.emit('signUp', ko.toJS(_this.user));
				};

				// events
				_this.socket.on('connect', function () {
					console.log('this client connected to server');
					_this.user().connectionStatus(_this.user().CONNECTION_STATUS_CONNECTED);

					// TODO save "rememberMe" and user information in cookie and avoid time out
					setTimeout(function(){
						if(_this.user().rememberMe()){
							_this.signIn();
						}
					}, 100);
				});

				_this.socket.on('signedIn', function (data) {
					ko.postbox.publish('flashMessages', new FlashMessageViewModel(data.message));
					// init data
					_this.notifyServer = false;
					_this.user()._id(data.user._id);
					_this.user().email(data.user.email);
					_this.notifyServer = true;
					// set login stauts
					_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_IN);
					// show panels
					ko.postbox.publish("gamesListIsActive", true);
					ko.postbox.publish("usersListIsActive", true);
					ko.postbox.publish("flashMessagesIsActive", true);
					ko.postbox.publish("chatIsActive", true);
				});

				_this.socket.on('signedOut', function (data) {
					ko.postbox.publish('flashMessages', new FlashMessageViewModel(data.message));
					_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_OUT);
				});

				_this.socket.on('disconnect', function () {
					var message = {text: 'disconnected from server', type: 'danger'};
					ko.postbox.publish('flashMessages', new FlashMessageViewModel(message));
					_this.user().connectionStatus(_this.user().CONNECTION_STATUS_DISCONNECTED);
					_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_OUT);
				});

				_this.socket.on('reconnect_attempt', function () {
					console.log('trying to reconnect');
				});

				_this.socket.on('reconnect', function (data) {
					console.log('reconnecting', data);
					var message = {text: 'reconnected to server', type: 'success'};
					ko.postbox.publish('flashMessages', new FlashMessageViewModel(message));
					_this.user().connectionStatus(_this.user().CONNECTION_STATUS_CONNECTED);
				});

			};

			if (!instance) {
				instance = new LoginViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: LoginViewModelFactory
			},
			template: template
		};

	}
);