function PhotoTapAssistant(assistant, media, target) {
	this.assistant = assistant;
	this.media = media;
	this.target = target;
	//menu switch off
	AppMenu.noSwitch = true;
}

PhotoTapAssistant.prototype = {
	setup: function(widget) {
		this.widget = widget;

		if (this.media.user_has_liked) {
			this.assistant.controller.get('like').outerHTML = '';
			this.assistant.controller.get('comment').setStyle({
				'width': '50%'
			});
			this.assistant.controller.get('save').setStyle({
				'width': '50%'
			});
		}

		//listeners
		this.clickHandler = this.onClick.bind(this);
		this.assistant.controller.listen(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
	},
	cleanup: function() {
		this.assistant.controller.stopListening(this.assistant.controller.document, Mojo.Event.tap, this.clickHandler);
		AppMenu.noSwitch = false;
	},
	activate: function() {},
	deactivate: function() {},
	onClick: function(event) {
		var that = this;
		var item = that.media;
		var target = that.target;
		var t = event.target;
		if (! (t.id)) {
			t = t.parentNode;
		}
		Mojo.Log.error('tapppp---->' + t.id);
		switch (t.id) {
		case 'like':
			that.widget.mojo.close();
			if (item['user_has_liked']) {
				AppSDK.delMediaLikes({
					onSuccess:
					function() {
						item['user_has_liked'] = false;
						item['likes']['count'] = (item['likes']['count'] - 1);
						//notify like changed
						var p = target.parentNode;
						var children = Element.childElements($(p));
						children.each(function(ins) {
							var s = $(ins);
							if (s.hasClassName('like')) {
								var likes = Element.childElements(s);
								likes.each(function(els) {
									var e = $(els);
									if (e.hasClassName('likeContent')) {
										Mojo.Log.error('like element got------->');
										if (e.hasClassName('liked')) {
											e.removeClassName('liked');
										}
										e.addClassName('unliked');
									}
								});
							}
						});
						//that.controller.modelChanged(that.modelList);
					}
				},
				item['id']);
			} else {
				AppSDK.postMediaLikes({
					onSuccess: function() {
						item['user_has_liked'] = true;
						item['likes']['count'] = (item['likes']['count'] + 1);
						//notify like changed
						var photoElement = that.assistant.controller.get('photo_' + item.id);
						var likeElement = photoElement.select('[class~=likeContent]').first();
						if (likeElement) {
							if (likeElement.hasClassName('unliked')) {
								likeElement.removeClassName('unliked');
							}
							likeElement.addClassName('liked');
							//Mojo.Log.error('like element: ' + likeElement.outerHTML);
						} else {
							var p = target.parentNode;
							var children = Element.childElements($(p));
							children.each(function(ins) {
								var s = $(ins);
								if (s.hasClassName('like')) {
									var likes = Element.childElements(s);
									likes.each(function(els) {
										var e = $(els);
										if (e.hasClassName('likeContent')) {
											Mojo.Log.error('like element got------->');
											if (e.hasClassName('unliked')) {
												e.removeClassName('unliked');
											}
											e.addClassName('liked');
										}
									});
								}
							});
						}
						//that.controller.modelChanged(that.modelList);
					}
				},
				item['id']);
			}
			break;
		case 'comment':
			that.widget.mojo.close();
			that.assistant.controller.showDialog({
				template:
				'templates/comment-add-dialog',
				assistant: new CommentAddAssistant(that.assistant, that.media),
				preventCancel: true
			});
			break;
		case 'save':
			that.widget.mojo.close();
			//download it
			var standardResolution = item['images']['standard_resolution']['url'];
			Mojo.Log.info('downloading---> ' + standardResolution);

			that.assistant.controller.serviceRequest('palm://com.palm.downloadmanager/', {
				method: 'download',
				parameters: {
					target: standardResolution,
					targetDir: '/media/internal/instagrio',
					targetFilename: item.user.username + '_' + item.created_time + '.jpg',
					keepFilenameOnRedirect: false,
					subscribe: false
				},
				onSuccess: function(resp) {
					Mojo.Log.error(Object.toJSON(resp))
				},
				onFailure: function(e) {
					Mojo.Log.error(Object.toJSON(e))
				}
			});
			AppHandler.alert('Photo Saving..');
			break;
		default:
			return;
		}
	}
};

