define(['knockout', 'text!templates/chat.html', 'UserViewModel', 'MessageViewModel', 'underscore', 'moment'],
	function (ko, template, UserViewModel, MessageViewModel, _, moment) {

		// TODO add real private messages

		var ChatViewModel = function (params) {
			if (!params) params = {};

			var _this = this;
			_this.socket = params.socket;

			// observables
			_this.user = params.user;
			_this.selectedUser = ko.observable().syncWith('selectedUser');
			_this.newMessage = ko.observable(new MessageViewModel({}));
			_this.messages = ko.observableArray([]);

			// methods
			_this.sendChatMessage = function () {
				console.log('sending chat message, test: ', _this);
				// set date and sender
				_this.newMessage().date(moment());
				_this.newMessage().sender(_this.user().name());
				_this.newMessage().recipient(_this.selectedUser());
				// create static message data and notify server
				var newMessageData = ko.toJS(_this.newMessage);
				_this.messages.push(new MessageViewModel(newMessageData));
				_this.showLastMessageInMessages();
				_this.socket.emit('chatMessageToServer', newMessageData);
				_this.newMessage().text('');
			};

			_this.onSubmit = function () {
				_this.sendChatMessage();
			};

			_this.onEnter = function (data, event) {
				if (event.keyCode === 13) {
					_this.sendChatMessage();
				} else {
					return true;
				}
			};

			_this.showLastMessageInMessages = function () {
				var messagesArea = document.getElementById('chat-messages');
				messagesArea.scrollTop = messagesArea.scrollHeight;
			};

			// watch data changes
			_this.user().loginStatus.subscribe(function (newStatus) {
				// clear messages
				_this.messages([]);
			});

			// events
			_this.socket.on('chatMessageFromServer', function (data) {
				_this.messages.push(new MessageViewModel((data)));
				_this.showLastMessageInMessages();
			});

		};

		return {
			viewModel: ChatViewModel,
			template: template
		};

	}
);