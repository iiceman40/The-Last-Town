define(['knockout', 'text!templates/login.html', 'UserViewModel', 'underscore'],function (ko, template, UserViewModel, _) {

	var LoginViewModel = function (params) {
		if(!params) params = {};

		this.MESSAGE_TYPE_DEFAULT = 'info';

		var _this = this;
		_this.socket = params.socket;

		// observables
		_this.user = params.user;
		_this.message = ko.observable('');
		_this.messageType = ko.observable(this.MESSAGE_TYPE_DEFAULT);
		_this.connectedUsers = params.connectedUsers;

		// computed observables

		// methods
		_this.signIn = function(){
			_this.socket.emit('signIn', ko.toJS(_this.user));
			return true;
		};

		_this.signOut = function(){
			_this.connectedUsers([]);
			_this.socket.emit('signOut', ko.toJS(_this.user));
		};

		_this.signUp = function(){
			_this.socket.emit('signUp', ko.toJS(_this.user));
		};

		_this.updateConnectedUsers = function(connectedUsersData){
			_.each(connectedUsersData, function(userData, index){
				var userViewModel = _.findWhere(_this.connectedUsers(), {_id: userData._id});
				if(userViewModel === undefined){
					_this.connectedUsers.push(new UserViewModel(userData));
				}
			});
			_this.connectedUsers(connectedUsersData);
		};

		// watch data changes
		_this.notifyServer = true;
		_this.user().name.subscribe(function(){
			if(_this.notifyServer) {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			}
		});

		_this.user().email.subscribe(function(){
			if(_this.notifyServer) {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			}
		});

		_this.user().password.subscribe(function(){
			if(_this.notifyServer) {
				_this.socket.emit('updateData', ko.toJS(_this.user));
			}
		});

		// events
		_this.socket.on('connect', function(){
			console.log('this client connected to server');
			_this.user().connectionStatus(_this.user().CONNECTION_STATUS_CONNECTED);
		});

		_this.socket.on('signedIn', function(data){
			console.log('signed in', data);
			_this.message(data.message);
			_this.messageType(data.messageType || _this.MESSAGE_TYPE_DEFAULT);
			_this.notifyServer = false;
			_this.user().email(data.user.email);
			_this.notifyServer = true;
			_this.updateConnectedUsers(data.connectedUsers);
			_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_IN);
		});

		_this.socket.on('signedOut', function(data){
			console.log('signed out', data);
			_this.message(data.message);
			_this.messageType(data.messageType || _this.MESSAGE_TYPE_DEFAULT);
			_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_OUT);
		});

		_this.socket.on('updateConnectedUsers', function(data){
			console.log('updating connected users', data);
			_this.updateConnectedUsers(data.connectedUsers);
		});

		_this.socket.on('info', function(data){
			console.log(data.message, data);
			_this.message(data.message);
			_this.messageType(data.messageType || _this.MESSAGE_TYPE_DEFAULT);
		});

		_this.socket.on('disconnect', function(){
			_this.message('client got disconnected');
			_this.messageType('danger');
			_this.user().connectionStatus(_this.user().CONNECTION_STATUS_DISCONNECTED);
			_this.user().loginStatus(_this.user().LOGIN_STATUS_LOGGED_OUT);
		});

		_this.socket.on('reconnect_attempt', function(){
			console.log('trying to reconnect');
		});

		_this.socket.on('reconnect', function(){
			console.log('reconnected successfully');
			_this.message('reconnected');
			_this.messageType('success');
			_this.user().connectionStatus(_this.user().CONNECTION_STATUS_CONNECTED);
		});

	};

	return {
		viewModel: LoginViewModel,
		template: template
	};

});