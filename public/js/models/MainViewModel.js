define(['knockout', 'MessageEditor'], function(ko, MessageEditor) {
	return function MainViewModel(params) {
		// main observables
		this.firstName = ko.observable('Bert');
		this.lastName = ko.observable('Reynolds');

		// computed observables
		this.fullName = ko.pureComputed(function() {
			return [this.firstName(), this.lastName()].join(' ');
		}, this);

		// register components
		ko.components.register('message-editor', MessageEditor);
	};
});