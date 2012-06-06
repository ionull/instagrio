var LocationGalleryAssistant = Class.create(BaseAssistant, {
	initialize: function($super, lat, lng) {
		this.TAG = 'LocationGalleryAssistant';
		Mojo.Log.info(this.TAG, 'initialize');
		$super(lat, lng);
		this.lat = lat;
		this.lng = lng;
	},
	setup: function() {
		Mojo.Log.info(this.TAG, 'setup');
		var that = this;

		var photoListHelper = new PhotoListHelper({
			idList: 'feed-list',
			controller: this.controller,
			linkable: true,
			assistant: this
		});

		this.callback = photoListHelper.callback();
		AppSDK.getMediaSearch(this.callback, this.lat, this.lng);
	},
	activate: function() {
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
	}
});

