var BaseAssistant = Class.create({
	initialize: function() {},
	setup: function() {
		Mojo.Log.info('base setup');
		AppMenu.get(this).showToggle();
		this.onMaxmizeHandler = this.onMaxmizeOrMinmize.bind(this);
	},
	activate: function(){
		Mojo.Log.info('base activate');
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
	},
	deactivate: function(){
		Mojo.Log.info('base deactivate');
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
		AppMenu.get(this).keepFolding();
	},
	cleanup: function(){
		Mojo.Log.info('base cleanup');
		if(this.photoListHelper) {
			this.photoListHelper.cleanup();
		}
	},
	onMaxmizeOrMinmize: function() {
		AppMenu.get(this).showToggle();
	}
});
