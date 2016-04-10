define(['knockout', 'knockout-postbox', 'text!templates/flash-messages.html', 'moment', 'FlashMessageViewModel'],
	function (ko, koPostBox, template, moment, FlashMessageViewModel) {

		var instance = null;

		var FlashMessagesViewModelFactory = function (params, componentInfo) {
			if (!params) params = {};

			var FlashMessagesViewModel = function (params) {
				var _this = this;
				_this.socket = params.socket;

				_this.settings = {
					autoHideFlashMessages: false,
					timeUntilAutoHide: 5000,
					maxNumberVisible: 3
				};

				// observables
				_this.isActive = ko.observable(false).subscribeTo('flashMessagesIsActive');
				_this.flashMessages = ko.observableArray();
				_this.flashMessages.subscribe(function () {
					if(_this.flashMessages().length === 0){
						_this.isActive(false);
					} else {
						_this.isActive(true);
					}
					console.log('flashMessages: ', _this.flashMessages());
				});

				// methods
				_this.deactivateFlashMessages = function(){
					ko.postbox.publish("flashMessagesIsActive", false);
				};

				/**
				 * @param {FlashMessageViewModel} flashMessage
				 */
				_this.addFlashMessage = function (flashMessage) {
					flashMessage.date = moment();
					_this.flashMessages.push(flashMessage);

					if (_this.settings.autoHideFlashMessages) {
						setTimeout(function () {
							_this.hideFlashMessage(flashMessage);
						}, _this.settings.timeUntilAutoHide)
					}

					if (_this.flashMessages().length > _this.settings.maxNumberVisible) {
						_this.hideFlashMessage(_this.flashMessages()[_this.flashMessages().length - (_this.settings.maxNumberVisible + 1)]);
					}
				};

				/**
				 * @param {FlashMessageViewModel} flashMessage
				 */
				_this.removeFlashMessage = function (flashMessage) {
					_this.flashMessages.remove(flashMessage);
				};

				/**
				 * @param {FlashMessageViewModel} flashMessage
				 */
				_this.hideFlashMessage = function (flashMessage) {
					flashMessage.isVisible(false);
				};

				_this.hideAll = function(){
					_.each(_this.flashMessages(), function(flashMessage, index){
						flashMessage.isVisible(false);
					});
				};

				_this.showAll = function(){
					_.each(_this.flashMessages(), function(flashMessage, index){
						flashMessage.isVisible(true);
					});
				};

				_this.removeAll = function(){
					_this.flashMessages([]);
				};

				// subPub - subscriptions
				ko.postbox.subscribe("flashMessages", function (flashMessage) {
					_this.addFlashMessage(flashMessage);
				});

				// events
				_this.socket.on('flash-message', function (data) {
					_this.addFlashMessage(new FlashMessageViewModel(data.message))
				});
			};

			if (!instance) {
				instance = new FlashMessagesViewModel(params);
			}

			return instance;
		};

		return {
			viewModel: {
				createViewModel: FlashMessagesViewModelFactory
			},
			template: template
		};

	}
);