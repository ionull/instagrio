function CommentAddAssistant(assistant, media) {
	this.assistant = assistant;
	this.media = media;
}

CommentAddAssistant.prototype = {
	setup: function(widget) {
		this.widget = widget;

		this.assistant.controller.setupWidget('content', this.attributes = {
			modelProperty: 'content',
			hintText: 'content',
			multiline: true,
			enterSubmits: false,
			focus: true
		},
		this.model = {
			content: '',
			diabled: false
		});
		this.assistant.controller.setupWidget("okButton", {},
		{
			label: "OK",
			disabled: false
		});
		this.assistant.controller.setupWidget("cancelButton", {},
		{
			label: "Cancel",
			disabled: false
		});

		//listeners
		this.okButtonHandler = this.sendComment.bind(this);
		this.assistant.controller.listen("okButton", Mojo.Event.tap, this.okButtonHandler);
		this.assistant.controller.listen("cancelButton", Mojo.Event.tap, this.widget.mojo.close);
	},
	cleanup: function() {
		this.assistant.controller.stopListening("okButton", Mojo.Event.tap, this.okButtonHandler);
		this.assistant.controller.stopListening("cancelButton", Mojo.Event.tap, this.widget.mojo.close);
	},
	activate: function() {},
	deactivate: function() {},
	sendComment: function() {
		var that = this;
		Mojo.Log.info('on send comment ' + this.model.content);
		if (this.model.content == '') {
			return;
		} else {
			AppSDK.postMediaComments({
				onSuccess: function() {
					that.widget.mojo.close();
				},
				onFailure: function(e) {
					//TODO banner notify
				}
			},
			this.media.id, this.model.content);
		}
	}
};

