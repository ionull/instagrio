var BaseAssistant = Class.create({
	initialize: function() {},
	setup: function() {
		Mojo.Log.info('base setup');
		AppMenu.get(this).showToggle();
		this.onMaxmizeHandler = this.onMaxmizeOrMinmize.bind(this);
		this.onGlobalKeyupListener = this.onGlobalKeyup.bind(this);
		this.onGlobalMouseDownListener = this.onGlobalMouseDown.bind(this);

		//global menu set
		AppAssistant.helper.menu(this.controller);
	},
	activate: function() {
		Mojo.Log.info('base activate');
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.document, 'keyup', this.onGlobalKeyupListener, false);
		Mojo.Event.listen(this.controller.document, 'mousedown', this.onGlobalMouseDownListener, false);
		if (this.photoListHelper) {
			this.photoListHelper.activate();
		}
	},
	deactivate: function() {
		Mojo.Log.info('base deactivate');
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.document, 'keyup', this.onGlobalKeyupListener, false);
		Mojo.Event.stopListening(this.controller.document, 'mousedown', this.onGlobalMouseDownListener, false);
		AppMenu.get(this).keepFolding();
		if (this.photoListHelper) {
			this.photoListHelper.deactivate();
		}
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
		
		if(this.noSearch || JustSearchAssistant.doing || CommentAddAssistant.doing) {
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
	},
	onGlobalMouseDown: function(e) {
		Mojo.Log.info('onGlobalMouseDown: ' + e.target.outerHTML);
		var target = e.target;
		switch(target.innerHTML) {
			case '+':
				AppMenu.get(this).toggleMenu();
				break;
			case 'HOT':
			case 'MINE':
			case 'HOME':
			case 'LIKED':
				AppMenu.get(this).keepFolding();
				AppMenu.get(this).menuTo(target.innerHTML.toLowerCase());
				break;
			default:
				if(!(target.id)) {
					target = target.parentNode;
				}
				if(target.id) {
					if(target.id == 'base-button') {
						AppMenu.get(this).toggleMenu();
						return;
					} else if(target.id.indexOf('nav-') >= 0) {
						AppMenu.get(this).menuTo(target.id.replace('nav-', ''));
					}
				}
				AppMenu.get(this).keepFolding();
				break;
		}
	}
});

