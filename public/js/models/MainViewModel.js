define(['knockout', 'socket.io', 'UsersListComponent'], function(ko, io, UsersListComponent) {
	var MainViewModel =  function MainViewModel(params) {
		this.STATUS_SIGNED_OUT = 0;
		this.STATUS_SIGNED_IN = 1;

		var _this = this;
		_this.socket = io();

		// main observables
		_this.username = ko.observable('');
		_this.password = ko.observable('');
		_this.status = ko.observable(_this.STATUS_SIGNED_OUT);
		_this.message = ko.observable('');
		_this.connectedUsers = ko.observableArray([]);

		// computed observables

		// methods
		_this.signIn = function(){
			_this.socket.emit('signIn', {name: _this.username(), password: _this.password()});
		};

		_this.signOut = function(){
			console.log('trigger signing user out');
			_this.socket.emit('signOut', {});
		};

		_this.signUp = function(){
			_this.socket.emit('signUp', {name: _this.username(), password: _this.password()});
		};

		// events
		_this.socket.on('signedIn', function(data){
			console.log('signed in', data);
			_this.message(data.message);
			_this.connectedUsers(data.connectedUsers); // TODO create and use user view model
			_this.status(_this.STATUS_SIGNED_IN);
		});

		_this.socket.on('signedOut', function(data){
			console.log('signed out', data);
			_this.message(data.message);
			_this.status(_this.STATUS_SIGNED_OUT);
		});

		_this.socket.on('updateConnectedUsers', function(data){
			console.log('updating connected users', data);
			_this.connectedUsers(data.connectedUsers); // TODO create and use user view model
		});

		_this.socket.on('info', function(data){
			console.log(data.message, data);
			_this.message(data.message);
		});

		_this.socket.on('disconnect', function(){
			_this.message('disconnected');
			_this.status(_this.STATUS_SIGNED_OUT);
		});

		// register components
		ko.components.register('users-list', UsersListComponent);
		//ko.components.register('message-editor', MessageEditor);
	};

	// TODO use prototype - test with multiple client connections

	return MainViewModel;
});