var PhotoListHelper = Class.create((function() {
	var private_fn = {
		onMouseDown: function() {
			AppMenu.get().keepFolding();
		},
		onScroll: function() {
			//Mojo.Log.info('scrolling');
			//Mojo.Log.info(this.TAG, this.photoList.innerHTML);
			var floatBar = this.controller.get('float_bar');
			var floatAll = this.floatAll;
			var floatHeight = floatAll.getHeight();
			var items = this.modelList.items;
			if (items.length > 0) {
				//Mojo.Log.info('hacking ' + $('photo_' + items[0].id).cumulativeScrollOffset().top);
				//var firstEl = $('photo_' + items[0].id);
				var firstEl = this.controller.get('photo_' + items[0].id);
				if (firstEl != null && firstEl.cumulativeScrollOffset().top < 0) {
					floatAll.hide();
				}
			}
			for (i = 0; i < items.length; ++i) {
				var pID = items[i].id;
				//var currEl = $('photo_' + pID);
				var currEl = this.controller.get('photo_' + pID);
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
							//var nextEl = $('photo_' + pIDNext);
							var nextEl = this.controller.get('photo_' + pIDNext);
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
					var children = Element.childElements($(floatBar));
					children.each(function(ins) {
						var s = $(ins);
						if (!s.hasClassName('floating')) {
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
		onTap: function(event) {
			PhotoListHelper.timeTap = new Date();
			//AppHandler.alert('onTap!');
			if (PhotoListHelper.timeHold && (( + (PhotoListHelper.timeTap)) - ( + (PhotoListHelper.timeHold.getTime())) < 500)) {
				return;
			}
			var that = this;
			var target = event.target;
			Mojo.Log.error('tap----->: ' + target.outerHTML);
			var s = $(target);
			if (s.hasClassName('likeContent')) {
				//show like list
				var media = target.getAttribute('data-id');
				that.controller.stageController.pushScene('user-list', 'like', media);
			} else if (s.hasClassName('commentsCount')) {
				var media = target.getAttribute('data-id');
				that.controller.stageController.pushScene('comment-list', media);
			} else if (s.hasClassName('userInfo')) {
				var media = target.getAttribute('data-id');
				if (s.hasClassName('commentUser')) {
					for (var now in that.modelList.items) {
						var curr = that.modelList.items[now];
						if (curr.id == media) {
							var subID = target.getAttribute('sub-id');
							var comment = curr.comments.data[subID];
							that.controller.stageController.pushScene('user', {
								user: comment.from
							});
							break;
						}
					}
				} else if (s.hasClassName('photoUser')) {
					for (var now in that.modelList.items) {
						var curr = that.modelList.items[now];
						if (curr.id == media) {
							that.controller.stageController.pushScene('user', {
								user: curr.user
							});
							break;
						}
					}
				}
			} else if (s.hasClassName('location')) {
				var lat = target.getAttribute('lat');
				var lng = target.getAttribute('lng');
				if (lat && lng) {
					//show location photos
					that.controller.stageController.pushScene('location-gallery', lat, lng);
				}
			} else if (target.hasAttribute('data-action') && target.getAttribute('data-action') == 'image') {
				var media = target.getAttribute('data-id');
				for (var now in that.modelList.items) {
					var curr = that.modelList.items[now];
					if (curr.id == media) {
						that.controller.stageController.pushScene('photo-gallery', 'list', curr, that.modelList.items, that.assistant);
						break;
					}
				}
			}
		},
		onHoldEnd: function(event) {
			PhotoListHelper.timeHold = new Date();
			//AppHandler.alert('onHoldEnd!');
		},
		onHold: function(event) {
			PhotoListHelper.timeHold = new Date();
			var that = this;
			var target = event.target;
			Mojo.Log.error('hold--------->: ' + target.outerHTML);
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
					that.controller.showDialog({
						template:
						'templates/photo-tap-dialog',
						assistant: new PhotoTapAssistant(that, item, target, that.assistant),
						preventCancel: false
					});
					break;
				default:
					break;
				}
			}
		},
		onSuccess: function(response) {
			var response_text = response.responseText;
			Mojo.Log.error('feed ----------->: ' + response.status + response_text);
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
		 * 	linkable: if user profile avatar and user name can be clicked
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
			this.assistant.photoListHelper = this;
			this.controller.setupWidget(this.idList, {
				itemTemplate: 'templates/photo-list-item',
				listTemplate: 'templates/photo-list',
				//dividerTemplate: 'templates/photo-list-divider',
				formatters: {
					location: AppFormatter.location.bind(this),
					created_time: AppFormatter.time.bind(this),
					user: this.linkable ? AppFormatter.user.bind(this) : AppFormatter.user_nolink.bind(this),
					caption: AppFormatter.caption,
					'likes': AppFormatter.likesCount.bind(this),
					comments: AppFormatter.comments.bind(this),
					images: AppFormatter.images.bind(this),
					user_has_liked: AppFormatter.imageHeight.bind(this)
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
			this.listTapListener = private_fn.listWasTapped.bind(this);
			Mojo.Event.listen(this.photoList, Mojo.Event.listTap, this.listTapListener);

			this.scroller = this.controller.getSceneScroller();
			this.scrollerListener = private_fn.onScroll.bind(this);
			Mojo.Event.listen(this.scroller, 'scroll', this.scrollerListener);
			this.mousedownListener = private_fn.onMouseDown.bind(this);
			Mojo.Event.listen(this.scroller, 'mousedown', this.mousedownListener);

			//hold event on list item
			this.onHoldListener = private_fn.onHold.bind(this);
			//Mojo.Event.listen(this.controller.document, Mojo.Event.hold, this.onHoldListener);
			Mojo.Event.listen(this.photoList, Mojo.Event.hold, this.onHoldListener);
			this.onHoldEndListener = private_fn.onHoldEnd.bind(this);
			Mojo.Event.listen(this.photoList, Mojo.Event.holdEnd, this.onHoldEndListener);

			this.onTapListener = private_fn.onTap.bind(this);
			Mojo.Event.listen(this.photoList, Mojo.Event.tap, this.onTapListener);

			this.floatAll = this.controller.get('float_all');
			Mojo.Event.listen(this.floatAll, Mojo.Event.tap, this.onTapListener);
		},
		callback: function() {
			return {
				onSuccess: private_fn.onSuccess.bind(this),
				onFailure: private_fn.onFailure.bind(this)
			}
		},
		cleanup: function() {
			//Mojo.Log.error('on photo list cleanup---->');
			Mojo.Event.stopListening(this.photoList, Mojo.Event.listTap, this.listTapListener);
			Mojo.Event.stopListening(this.scroller, 'scroll', this.scrollerListener);
			Mojo.Event.stopListening(this.scroller, 'mousedown', this.mousedownListener);
			Mojo.Event.stopListening(this.photoList, Mojo.Event.hold, this.onHoldListener);
			Mojo.Event.stopListening(this.photoList, Mojo.Event.holdEnd, this.onHoldEndListener);

			Mojo.Event.stopListening(this.photoList, Mojo.Event.tap, this.onTapListener);
			Mojo.Event.stopListening(this.floatAll, Mojo.Event.tap, this.onTapListener);
		}
	};
})());

