var BaseAssistant = Class.create({
	initialize: function() {},
	setup: function() {
		Mojo.Log.info('base setup');
	},
	activate: function(){
		Mojo.Log.info('base activate');
		this.baseFirstEl = $(document.body.getElementsByTagName('*')[0]);
		this.baseFirstEl.setAttribute('tabindex',-1);
		this.baseFirstEl.focus();
		AppMenu.get().prevent(this.baseFirstEl);
	},
	deactivate: function(){
		Mojo.Log.info('base deactivate');
		AppMenu.get().dePrevent(this.baseFirstEl);
		AppMenu.get().keepFolding();
	},
	cleanup: function(){
		Mojo.Log.info('base cleanup');
		AppMenu.get().dePrevent(this.baseFirstEl);
		if(this.photoListHelper) {
			this.photoListHelper.cleanup();
		}
	}
});
