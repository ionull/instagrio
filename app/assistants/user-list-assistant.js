var UserListAssistant = Class.create(BaseAssistant, {
	initialize: function($super, media) {
		$super(media);
		this.media = media;
	},
	setup: function() {
		AppHandler.setAppBackground("#FFFFFF");
		var that = this;
		this.controller.setupWidget('user-list', {
			itemTemplate: 'user-list/user-list-item',
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
			listTitle: 'user list'
		});
		Mojo.Event.listen(this.controller.get('user-list'), Mojo.Event.listTap, this.listWasTapped.bind(this));
		AppSDK.getMediaLikes({
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
				Mojo.Log.info('user list size---->: ' + that.modelList.items.length);
				that.controller.modelChanged(that.modelList);
			},
			onFailure: function() {}
		},
		this.media);
	},
	listWasTapped: function(event) {
		this.controller.stageController.pushScene('user', {
			user: event.item
		});
	},
	activate: function() {
		if (AppMenu.get().isShow) AppMenu.get().hide(true);
	}
});

