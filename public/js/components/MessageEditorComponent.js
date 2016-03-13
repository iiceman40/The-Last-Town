define(['knockout', 'text!templates/message-editor.html'],function (ko, template) {

	var MessageEditorViewModel = function (params) {
		if(!params) params = {};

		this.text = ko.observable(params.initialText || '');
		this.receiver = params.receiver || '';
	};

	return {
		viewModel: MessageEditorViewModel,
		template: template
	};

});