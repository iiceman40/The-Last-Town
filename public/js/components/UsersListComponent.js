define(['knockout', 'text!templates/users-list.html', 'UserViewModel', 'underscore', 'bootstrap'],
	function (ko, template, UserViewModel, _, bootstrap) {

		var UsersListViewModel = function (params) {
			if (!params) params = {};

			var _this = this;
			_this.socket = params.socket;

			// TODO make user in list selectable and publish to post box -> chat can subscribe/sync

			this.connectedUsers = ko.observableArray([]);
			this.connectedUsersArray = ko.computed(function () {
				var usersObject = this.connectedUsers();
				return Object.keys(usersObject).map(function (key) {
					return usersObject[key]
				});
			}, this);

			_this.updateConnectedUsers = function (connectedUsersData) {
				_.each(connectedUsersData, function (userData, index) {
					var userViewModel = _.findWhere(_this.connectedUsers(), {_id: userData._id});
					if (userViewModel === undefined) {
						_this.connectedUsers.push(new UserViewModel(userData));
					}
				});
				_this.connectedUsers(connectedUsersData);
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