var PhotoGalleryAssistant = Class.create(BaseAssistant, {
	initialize: function($super, media, items) {
		$super(media);
		this.media = media;
		this.items = items;
		this.index = this.items.indexOf(media);
	},
	setup: function() {
		var that = this;
		//hide menu
		AppMenu.get().circle.hide();
		this.controller.setupWidget('photo-gallery', this.attributes = {
			noExtractFS: true
		},
		this.model = {
			onLeftFunction: function() {
				if (that.index > 0) {--that.index;
					that.setUrls();
				}
			},
			onRightFunction: function() {
				if (that.index + 1 < that.items.length) {++that.index;
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
	},
	cleanup: function() {
		AppMenu.get().showToggle();
		Mojo.Event.stopListening(this.photoGallery, Mojo.Event.hold, this.onHoldListener);
		Mojo.Event.stopListening(this.controller.window, 'resize', this.onWindowResizeHandler);
	},
	onHold: function(event) {
		var that = this;
		//show alert what to do
		that.controller.showDialog({
			template: 'templates/photo-tap-dialog',
			assistant: new PhotoTapAssistant(that, that.items[that.index], event.target),
			preventCancel: false
		});
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
		this.photoGallery.mojo.centerUrlProvided(this.getPhoto(that.items[that.index]));
		if (this.index > 0) {
			that.photoGallery.mojo.leftUrlProvided(this.getPhoto(that.items[that.index - 1]));
		}
		if (this.items.length - this.index - 1 > 0) {
			that.photoGallery.mojo.rightUrlProvided(this.getPhoto(that.items[that.index + 1]));
		}
	},
	activate: function() {
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
		this.controller.enableFullScreenMode(true);
		this.controller.stageController.setWindowOrientation('up');
		this.photoGallery.mojo.manualSize(Mojo.Environment.DeviceInfo.screenWidth, Mojo.Environment.DeviceInfo.screenHeight);
		this.setUrls();
	},
	onWindowResize: function(event) {
		if(this.photoGallery && this.photoGallery.mojo) {
			this.photoGallery.mojo.manualSize(this.controller.window.innerWidth, this.controller.window.innerHeight);
		}
	}
});

