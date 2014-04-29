var TagGalleryAssistant = Class.create(BaseAssistant, {
	initialize: function($super, tag) {
		this.TAG = 'TagGalleryAssistant';
		Mojo.Log.info(this.TAG, 'initialize');
		$super(tag);
		this.tag = tag;
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
		AppSDK.getTagsSearch(this.callback, this.tag);
	},
	loadMore: function(nextMaxId) {
		Mojo.Log.error('loading more..' + nextMaxId);
		var callback = {
			onSuccess: this.callback.onSuccess.bind(this),
			onFailure: this.callback.onFailure.bind(this),
			nextMaxId: nextMaxId
		};
		AppSDK.getTagsSearch(this.callback, this.tag);
	},
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

