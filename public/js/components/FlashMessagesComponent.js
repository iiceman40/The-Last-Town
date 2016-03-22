define(['knockout', 'knockout-postbox', 'text!templates/flash-messages.html', 'moment'],
	function (ko, koPostBox, template, moment) {

	var FlashMessagesViewModel = function (params) {
		if (!params) params = {};

		var _this = this;

		_this.settings = {
			autoHideFlashMessages: false,
			timeUntilAutoHide: 5000,
			maxNumberVisible: 3
		};

		// observables
		_this.flashMessages = ko.observableArray();
		_this.flashMessages.subscribe(function(){
			console.log('flashMessages: ', _this.flashMessages());
		});

		// methods
		_this.removeFlashMessage = function(flashMessage){
			_this.flashMessages.remove(flashMessage);
		};

		_this.hideFlashMessage = function(flashMessage){
			flashMessage.isVisible(false);
		};

		ko.postbox.subscribe("flashMessages", function(flashMessage){
			flashMessage.date = moment();
			_this.flashMessages.push(flashMessage);
			if(_this.settings.autoHideFlashMessages) {
				setTimeout(function(){
					_this.hideFlashMessage(flashMessage);
				},_this.settings.timeUntilAutoHide)
			}
			if(_this.flashMessages().length > _this.settings.maxNumberVisible){
				_this.hideFlashMessage(_this.flashMessages()[_this.flashMessages().length - (_this.settings.maxNumberVisible + 1)]);
			}
		});

	};

	return {
		viewModel: FlashMessagesViewModel,
		template: template
	};

});