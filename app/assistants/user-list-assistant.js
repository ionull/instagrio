var UserListAssistant = Class.create(BaseAssistant, {
	initialize: function($super, action, media) {
		$super(media);
		this.action = action;
		this.media = media;
		//AppHandler.alert('on user list:' + action);
	},
	setup: function() {
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
		var callbacks = {
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
		};
		switch(this.action) {
			case 'like':
			AppSDK.getMediaLikes(callbacks, this.media);
			break;
			case 'foed':
			AppSDK.getUsersFollowedBy(callbacks, this.media);
			break;
			case 'foing':
			AppSDK.getUsersFollows(callbacks, this.media);
			break;
			case 'search':
			AppSDK.getUsersSearch(callbacks, this.media);
			default:
			break;
		}
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

