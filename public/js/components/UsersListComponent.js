define(['knockout', 'text!templates/users-list.html', 'UserViewModel', 'underscore', 'bootstrap'],
	function (ko, template, UserViewModel, _, bootstrap) {

		var UsersListViewModel = function (params) {
			if (!params) params = {};

			var _this = this;
			_this.socket = params.socket;
			_this.user = params.user;

			this.selectedUser = ko.observable().syncWith('selectedUser');
			this.connectedUsers = ko.observableArray([]);

			/**
			 * maps the connectedUsers array to an object with the _id as index
			 */
			this.connectedUsersObject = ko.computed(function () {
				console.log('computing users map object');
				return _.object(_.map(_this.connectedUsers(), function(user) {
					return [user._id(), user]
				}));
			}, this);

			/**
			 * updates the UserViewModel in connectedUsers observable Array with user data from the server
			 * @param {Array} connectedUsersData
			 */
			_this.updateConnectedUsers = function (connectedUsersData) {
				var connectedUsers = [];
				_.each(connectedUsersData, function (userData, index) {
					connectedUsers.push(new UserViewModel(userData));
				});
				_this.connectedUsers(connectedUsers);
			};

			/**
			 * checks if the given UserViewModel has the same _id as the currently logged in user
			 * @param {UserViewModel} user
			 * @returns {boolean}
			 */
			_this.thisIsMe = function(user){
				return user._id() === _this.user()._id();
			};

			/**
			 * toggles the select attribute in a given userViewModel
			 * @param {UserViewModel} user
			 */
			_this.toggleSelectUser = function(user){
				if(user === _this.selectedUser()){
					_this.selectedUser(undefined);
				} else {
					_this.selectedUser(user);
				}
			};

			// events
			_this.socket.on('updateConnectedUsers', function (data) {
				console.log('updating connected users', data);
				_this.updateConnectedUsers(data.connectedUsers);
			});
		};

		return {
			viewModel: UsersListViewModel,
			template: template
		};

	}
);