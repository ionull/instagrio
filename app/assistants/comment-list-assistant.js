var CommentListAssistant = Class.create(BaseAssistant, {
	initialize: function($super, media) {
		$super(media);
		this.media = media;
	},
	setup: function($super) {
		$super();
		var that = this;
		this.controller.setupWidget('comment-list', {
			itemTemplate: 'comment-list/comment-list-item',
			listTemplate: 'templates/photo-list',
			formatters: {
				index: AppFormatter.index.bind(this)
			},
			uniquenessProperty: 'id',
			fixedHeightItems: false,
			hasNoWidgets: true
		},
		this.modelList = {
			items: [],
			listTitle: 'comment list'
		});
		Mojo.Event.listen(this.controller.get('comment-list'), Mojo.Event.listTap, this.listWasTapped.bind(this));
		AppSDK.getMediaComments({
			onSuccess: function(result) {
				var json = result.responseJSON;
				var data = $A(json.data);
				that.modelList.items = [];
				for (var i = 0; i < data.length; ++i) {
					if (typeof data[i] != "function") {
						data[i]['index'] = i;
						that.modelList.items.push(data[i]);
					}
					else {
						//
					}
				}
				Mojo.Log.info('comment list size---->: ' + that.modelList.items.length);
				that.controller.modelChanged(that.modelList);
			},
			onFailure: function() {}
		},
		this.media);
	},
	listWasTapped: function(event) {
		this.controller.stageController.pushScene('user', {
			user: event.item.from
		});
	},
	activate: function() {
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
	}
});

