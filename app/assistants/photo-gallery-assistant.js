var PhotoGalleryAssistant = Class.create(BaseAssistant, {
	initialize: function($super, action, media, items) {
		$super(action, media, items);
		this.action = action;
		//Mojo.Log.error('action: ' + action);
		if (this.action == 'list') {
			this.media = media;
			this.items = items;
			this.index = this.items.indexOf(media);
		} else {
			this.index = - 1;
			this.items = [];
		}
		this.noSearch = true;
	},
	setup: function($super) {
		Mojo.Log.error('setup');
		$super();
		var that = this;
		//hide menu
		AppMenu.get(this).hideToggle();
		this.controller.get('container-circle').hide();
		this.controller.setupWidget('photo-gallery', this.attributes = {
			noExtractFS: true
		},
		this.model = {
			onLeftFunction: function() {
				if (that.index > 0) {
					that.index--;
					that.setUrls();
				}
			},
			onRightFunction: function() {
				if (that.index + 1 < that.items.length) {
					that.index++;
					that.setUrls();
				}
			}
		},
		this.modelList = {
			items: [],
			listTitle: 'list'
		});

		this.photoGallery = this.controller.get('photo-gallery');
		this.onHoldListener = this.onHold.bind(this);
		Mojo.Event.listen(this.photoGallery, Mojo.Event.hold, this.onHoldListener);
		this.onWindowResizeHandler = this.onWindowResize.bind(this);
		Mojo.Event.listen(this.controller.window, 'resize', this.onWindowResizeHandler);
		this.onMaxmizeHandler = this.onMaxmize.bind(this);
		this.onMinmizeHandler = this.onMinmize.bind(this);
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.listen(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMinmizeHandler, false);

		//if dock mode
		if (that.action == 'dock-mode') {
			Mojo.Log.error('start dock mode');
			that.startDockMode();
		}
	},
	startDockMode: function() {
		var that = this;
		//try again after 1 min
		//prevent gallery stop while dock mode
		var fail = function() {
			var t = setTimeout(function() {
				clearTimeout(t);
				that.startDockMode();
			},
			600000);
		};
		var fetchTimer = setTimeout(function() {
			//maybe request time out
			fail();
		},
		600000);
		AppSDK.getPopular({
			onSuccess: function(result) {
				//AppHandler.alert('dockmode popular');
				clearTimeout(fetchTimer);
				var json = result.responseJSON;
				Mojo.Log.error('dock result:' + result.responseText);
				that.items = json.data;
				//AppHandler.alert('items length' + that.items.length);
				try {
					if (that.items && that.items.length > 0) {
						that.index = 0;
						that.setUrls();
						that.setDockTimer();
					} else {
						fail();
					}
				} catch(e) {
					fail();
				}
			},
			onFailure: function(r) {
				Mojo.Log.error('dock result fail :' + JSON.stringify(r));
				fail();
				clearTimeout(fetchTimer);
			}
		});
	},
	setDockTimer: function() {
		//Mojo.Log.error('setDockTimer');
		//AppHandler.alert('dockmode popular start');
		var that = this;
		var t = setTimeout(function() {
			clearTimeout(t);
			//AppHandler.alert('dockmode popular timeout');
			if (that.isMin) {
				Mojo.Log.error('is min do nothing');
				return;
			}
			if (that.index + 1 == that.items.length) {
				that.startDockMode();
			} else {
				that.index++;
				that.setUrls();
				that.setDockTimer();
			}
		},
		10000);
	},
	cleanup: function($super) {
		Mojo.Log.error('cleanup');
		$super();
		Mojo.Event.stopListening(this.photoGallery, Mojo.Event.hold, this.onHoldListener);
		Mojo.Event.stopListening(this.controller.window, 'resize', this.onWindowResizeHandler);
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageActivate, this.onMaxmizeHandler, false);
		Mojo.Event.stopListening(this.controller.stageController.document, Mojo.Event.stageDeactivate, this.onMinmizeHandler, false);
		AppMenu.get(this).showToggle();
	},
	onMaxmize: function() {
		AppMenu.get(this).hideToggle();
		this.isMin = false;
		//this.setDockTimer();
	},
	onMinmize: function() {
		AppMenu.get(this).hideToggle();
		this.isMin = true;
		if (this.action == 'dock-mode') {
			var appController = Mojo.Controller.getAppController();
			appController.closeStage('dock');
		}
	},
	onHold: function(event) {
		var that = this;
		//show alert what to do
		if (that.index >= 0) {
			that.controller.showDialog({
				template: 'templates/photo-tap-dialog',
				assistant: new PhotoTapAssistant(that, that.items[that.index], event.target),
				preventCancel: false
			});
		}
	},
	getPhoto: function(item) {
		if (item) {
			var sHeight = Mojo.Environment.DeviceInfo.screenWidth;
			if (sHeight > 500) {
				return item.images.standard_resolution.url;
			} else {
				return item.images.low_resolution.url;
			}
		} else {
			return '';
		}
	},
	setUrls: function() {
		var that = this;
		if (that.index >= 0) {
			this.photoGallery.mojo.centerUrlProvided(this.getPhoto(that.items[that.index]));
		}
		if (this.index > 0) {
			that.photoGallery.mojo.leftUrlProvided(this.getPhoto(that.items[that.index - 1]));
		}
		if (this.items.length - this.index - 1 > 0) {
			that.photoGallery.mojo.rightUrlProvided(this.getPhoto(that.items[that.index + 1]));
		}
	},
	activate: function($super) {
		Mojo.Log.error('activate');
		$super();
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
		this.controller.enableFullScreenMode(true);
		this.controller.stageController.setWindowOrientation('up');
		this.photoGallery.mojo.manualSize(Mojo.Environment.DeviceInfo.screenWidth, Mojo.Environment.DeviceInfo.screenHeight);
		this.setUrls();
	},
	deactivate: function($super) {
		Mojo.Log.error('deactivate');
		$super();
	},
	onWindowResize: function(event) {
		if (this.photoGallery && this.photoGallery.mojo) {
			this.photoGallery.mojo.manualSize(this.controller.window.innerWidth, this.controller.window.innerHeight);
		}
	}
});

