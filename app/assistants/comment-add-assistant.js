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

		//listeners
		this.clickHandler = this.onClick.bind(this);
		this.assistant.controller.listen(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
	},
	activate: function() {},
	deactivate: function() {
		this.assistant.controller.stopListening(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
		//FIXME why event lost after showDialog
		this.assistant.assistant.activate();
	},
	cleanup: function() {
	},
	onClick: function(event) {
		var target = event.target;
		if(!(target.id)) {
			target = target.parentNode;
		}
		switch(target.id) {
			case 'comment':
			this.sendComment();
			break;
			case 'cancel':
			this.widget.mojo.close();
			break;
		}
	},
	sendComment: function() {
		var that = this;
		Mojo.Log.info('on send comment ' + this.model.content);
		if (this.model.content == '') {
			return;
		} else {
			AppHandler.alert('commenting..');
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

