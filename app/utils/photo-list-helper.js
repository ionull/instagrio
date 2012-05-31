var PhotoListHelper = Class.create((function() {
	var private_fn = {
		onScroll: function() {
			//Mojo.Log.info('scrolling');
			//Mojo.Log.info(this.TAG, this.photoList.innerHTML);
			var floatBar = $('float_bar');
			var floatAll = $('float_all');
			var floatHeight = floatAll.getHeight();
			var items = this.modelList.items;
			if (items.length > 0) {
				//Mojo.Log.info('hacking ' + $('photo_' + items[0].id).cumulativeScrollOffset().top);
				var firstEl = $('photo_' + items[0].id);
				if (firstEl != null && firstEl.cumulativeScrollOffset().top < 0) {
					floatAll.hide();
				}
			}
			for (i = 0; i < items.length; ++i) {
				var pID = items[i].id;
				var currEl = $('photo_' + pID);
				//Mojo.Log.info('current pid:' + pID + ' element:' + currEl);
				if (currEl == null) {
					continue;
				}
				var top = currEl.viewportOffset().top;
				var height = currEl.getHeight();
				if (top <= 7 && top > - height) {
					//Mojo.Log.info('float got top:' + top);
					if (pID == this.modelList.currentFloat) { // && i != 0
						if (i < items.length - 1) {
							var pIDNext = items[i + 1].id;
							var nextEl = $('photo_' + pIDNext);
							var nextTop = nextEl.viewportOffset().top;
							var floatAndMargin = floatHeight + 7;
							//Mojo.Log.info('nextTop' + nextTop + ' floatAll height' + floatAndMargin);
							if (nextTop > 0 && nextTop < floatAndMargin) {
								var floatTop = nextTop - floatAndMargin + 'px';
								//Mojo.Log.info('floatTop ' + floatTop);
								floatAll.setStyle({
									'top': floatTop
								});
							}
							else {
								if (floatAll.getStyle('top') != '0px') {
									floatAll.setStyle({
										'top': 0
									});
								}
							}
						}
						if (i != 0) return;
					}
					else {
						this.modelList.currentFloat = pID;
					}

					floatAll[i == 0 && top == 7 ? 'hide': 'show']();

					floatBar.innerHTML = currEl.innerHTML;
					var els = floatBar.getElementsBySelector('img');
					els.each(function(ins) {
						var s = $(ins);
						if (!s.hasClassName('avatar')) {
							//Mojo.Log.info('not avatar: ' + s.outerHTML);
							s.outerHTML = '';
						}
					});
					break;
				}
			}
		},
		listWasTapped: function(event) {
			Mojo.Log.info('listWasTappedddd' + event.item.id);
			var items = this.modelList.items;
		},
		onHold: function(event) {
			var that = this;
			var target = event.target;
			Mojo.Log.info('hold--------->: ' + target.outerHTML);
			if (target && target.hasAttribute('data-action')) {
				var action = target.getAttribute('data-action');
				var dataID = target.getAttribute('data-id');
				var items = that.modelList.items;
				var item = null;
				for (var index in items) {
					if (items[index].id == dataID) {
						item = items[index];
						break;
					}
				}
				if (!item) {
					return;
				}
				switch (action) {
				case 'image':
					//show alert what to do
					var choices = [{
						label: 'Comment',
						value: 'comment',
						type: 'affirmative'
					},
					{
						label: 'Save',
						value: 'save',
						type: 'affirmative'
					}];
					if (! (item['user_has_liked'])) {
						choices.splice(0, 0, {
							label: item['user_has_liked'] ? 'Unlike': 'Like',
							value: 'like',
							type: 'affirmative'
						});
					}
					this.controller.showAlertDialog({
						onChoose: function(what) {
							switch (what) {
							case 'like':
								if (item['user_has_liked']) {
									AppSDK.delMediaLikes({
										onSuccess:
										function() {
											item['user_has_liked'] = false;
										}
									},
									item['id']);
								} else {
									AppSDK.postMediaLikes({
										onSuccess: function() {
											item['user_has_liked'] = true;
										}
									},
									item['id']);
								}
								break;
							case 'comment':
								that.controller.showDialog({
									template: 'templates/comment-add-dialog',
									assistant: new CommentAddAssistant(that, item),
									preventCancel: true
								});
								break;
							case 'save':
								//download it
								var standardResolution = item['images']['standard_resolution']['url'];
								Mojo.Log.info('downloading---> ' + standardResolution);

								that.controller.serviceRequest('palm://com.palm.downloadmanager/', {
									method: 'download',
									parameters: {
										target: standardResolution,
										targetDir: '/media/internal/instagrio',
										//targetFilename: target.getAttribute('file-name'),
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
								break;
							default:
								break;
							}
						},
						title: 'You want to:',
						message: '',
						choices: choices
					});
					break;
				default:
					break;
				}
			}
		},
		onSuccess: function(response) {
			var response_text = response.responseText;
			Mojo.Log.info('feed ----------->: ' + response.status + response_text);
			var json = response.responseJSON;
			var data = $A(json.data);
			Mojo.Log.info(this.TAG, data.length);
			this.modelList.items = [];
			for (var i = 0; i < data.length; ++i) {
				if (typeof data[i] != "function") {
					this.modelList.items.push(data[i]);
				}
				else {
					//
				}
			}
			this.controller.modelChanged(this.modelList);
			//Mojo.Log.info(this.TAG, this.photoList.innerHTML);
			this.photoList.mojo.revealItem(0, true);
		},
		onFailure: function() {}
	};

	return {
		/*
		 * opts {
		 * 	idList: id of list widget,
		 * 	controller,
		 * 	linkable: if user profile piction and user name can be clicked
		 * }
		 */
		initialize: function(opts) {
			if (opts != null) {
				var that = this;
				for (var now in opts) {
					Mojo.Log.info('initialize :' + now);
					that[now] = opts[now];
				}
				this.setup();
			}
		},
		setup: function() {
			this.controller.setupWidget(this.idList, {
				itemTemplate: 'templates/photo-list-item',
				listTemplate: 'templates/photo-list',
				//dividerTemplate: 'templates/photo-list-divider',
				formatters: {
					location: AppFormatter.location.bind(this),
					created_time: AppFormatter.time.bind(this),
					user: this.linkable ? AppFormatter.user.bind(this) : AppFormatter.user_nolink.bind(this),
					'likes': AppFormatter.likesCount.bind(this)
				},
				uniquenessProperty: 'id',
				fixedHeightItems: false,
				hasNoWidgets: true
			},
			this.modelList = {
				items: [],
				listTitle: $L('feed list')
			});

			this.photoList = this.controller.get(this.idList);
			Mojo.Event.listen(this.photoList, Mojo.Event.listTap, private_fn.listWasTapped.bind(this));

			this.scroller = this.controller.getSceneScroller();
			this.scrollerListener = private_fn.onScroll.bind(this);
			Mojo.Event.listen(this.scroller, 'scroll', this.scrollerListener);

			//hold event on list item
			Mojo.Event.listen(this.controller.document, Mojo.Event.hold, private_fn.onHold.bind(this));
		},
		callback: function() {
			return {
				onSuccess: private_fn.onSuccess.bind(this),
				onFailure: private_fn.onFailure.bind(this)
			}
		}
	};
})());

