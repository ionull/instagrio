function JustSearchAssistant(assistant, initValue) {
	this.assistant = assistant;
	JustSearchAssistant.doing = true;
	this.initValue = initValue;
}

JustSearchAssistant.prototype = {
	setup: function(widget) {
		this.widget = widget;

		this.assistant.controller.setupWidget('content', this.attributes = {
			modelProperty: 'content',
			hintText: 'content',
			multiline: true,
			enterSubmits: false,
			changeOnKeyPress: true,
			focus: true
		},
		this.model = {
			content: this.initValue,
			diabled: false
		});

		//listeners
		this.clickHandler = this.onClick.bind(this);
		this.assistant.controller.listen(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
		this.keyupHandler = this.onKeyup.bind(this);
		this.assistant.controller.listen(this.assistant.controller.document, 'keydown', this.keyupHandler);
	},
	activate: function() {},
	deactivate: function() {
		this.assistant.controller.stopListening(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
		this.assistant.controller.stopListening(this.assistant.controller.document, 'keydown', this.keyupHandler);
		//FIXME why event lost after showDialog
		this.assistant.assistant.activate();
	},
	cleanup: function() {
		JustSearchAssistant.doing = false;
	},
	onKeyup: function(event) {
		var that = this;
		if (Mojo.Char.isEnterKey(event.keyCode)) {
			event.stop();
			that.send();
		}
	},
	onClick: function(event) {
		var target = event.target;
		if (! (target.id)) {
			target = target.parentNode;
		}
		switch (target.id) {
		case 'search-user':
			this.send();
			break;
		case 'cancel':
			this.widget.mojo.close();
			break;
		}
	},
	send: function() {
		var that = this;
		Mojo.Log.info('on search user' + this.model.content);
		if (this.model.content == '') {
			return;
		} else {
			AppHandler.alert('searching..');
			that.widget.mojo.close();
			that.assistant.controller.stageController.pushScene('user-list', 'search', that.model.content);
		}
	}
};

