define(['knockout', 'text!templates/users-list.html'],function (ko, template) {

	var UsersListViewModel = function (params) {
		if(!params) params = {};

		this.connectedUsers = params.connectedUsers || ko.observableArray([]);
		this.connectedUsersArray = ko.computed(function(){
			var usersObject = this.connectedUsers();
			return Object.keys(usersObject).map(function (key) {return usersObject[key]});
		}, this);
	};

	return {
		viewModel: UsersListViewModel,
		template: template
	};

});