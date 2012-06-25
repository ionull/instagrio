var BaseAssistant = Class.create({
	initialize: function() {},
	setup: function() {
		Mojo.Log.info('base setup');
		AppMenu.get(this).showToggle();
		this.onMaxmizeHandler = this.onMaxmizeOrMinmize.bind(this);
		this.onGlobalKeyupListener = this.onGlobalKeyup.bind(this);
	},
	activate: function() {
		Mojo.Log.info('base activate');
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.document, 'keyup', this.onGlobalKeyupListener, false);
	},
	deactivate: function() {
		Mojo.Log.info('base deactivate');
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.document, 'keyup', this.onGlobalKeyupListener, false);
		AppMenu.get(this).keepFolding();
	},
	cleanup: function() {
		Mojo.Log.info('base cleanup');
		if (this.photoListHelper) {
			this.photoListHelper.cleanup();
		}
	},
	onMaxmizeOrMinmize: function() {
		AppMenu.get(this).showToggle();
	},
	onGlobalKeyup: function(e) {
		//Mojo.Log.error('onGlobalKeyup: ' + e.keyCode + ' value: ' + String.fromCharCode(e.keyCode));
		
		if(this.noSearch || JustSearchAssistant.doing) {
			return;
		}
		var value = String.fromCharCode(e.keyCode);
		if(value >= 'a' && value <= 'z' || value >= 'A' && value <= 'Z') {
			//if it is a valid usename
			//then search dialog
			this.controller.showDialog({
				template:
				'templates/just-search-dialog',
				assistant: new JustSearchAssistant(this, value),
				preventCancel: false
			});
		}
	}
});

