define(['knockout', 'text!templates/maps.html', 'underscore', 'moment'],
	function (ko, template, moment) {

	var MapsViewModel = function (params) {
		if(!params) params = {};

		var _this = this;
		_this.socket = params.socket;

		// observables
		_this.user = params.user;

		// computed observables

		// methods
		_this.createNewMap = function(){
			console.log('telling server to create new map');
			_this.socket.emit('createNewMap', {});
		};

		// events
		_this.socket.on('mapCreated', function(data){
			console.log('map has been created', data);
		});

	};

	return {
		viewModel: MapsViewModel,
		template: template
	};

});