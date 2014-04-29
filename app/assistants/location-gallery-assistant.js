var LocationGalleryAssistant = Class.create(BaseAssistant, {
	initialize: function($super, lat, lng) {
		this.TAG = 'LocationGalleryAssistant';
		Mojo.Log.info(this.TAG, 'initialize');
		$super(lat, lng);
		this.lat = lat;
		this.lng = lng;
	},
	setup: function($super) {
		$super();
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
	/*
	TODO cant load more
	loadMore: function(nextMaxId) {
		Mojo.Log.error('loading more..' + nextMaxId);
		var callback = {
			onSuccess: this.callback.onSuccess.bind(this),
			onFailure: this.callback.onFailure.bind(this),
			nextMaxId: nextMaxId
		};
		AppSDK.getMediaSearch(this.callback, this.lat, this.lng);
	},
	*/
	activate: function($super) {
		$super();
	},
	deactivate: function($super) {
		$super();
	},
	cleanup: function($super) {
		$super();
	}
});

