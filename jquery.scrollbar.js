/*
 * jQuery switchButton
 * 
 * Copyright 2011, L.STEVENIN
 * Released under the MIT license.
 *
 * Depends:
 *	jquery.ui.widget.js
 */

(function($, scrollbar){
	
	$.widget('scrollbar.scrollbar', {
		
		options: {
			classes: '',		// Extra classes for css styling
			wheel: 40,			// Scroll offset on mousewheel
			scroll: true,		// Allow / disallow mouse scrolling
			overlay: true,		// Scrollbars are overlaid
			autohide: true,		// Scrollbars are automatically hidden
			animate: {			// Scroll wheel animation - set to false to disable
				duration: 300,
				easing: 'swing'
			}
		},
		
		_create: function() {
			
			this.settings = {
				viewport: {},
				overview: {},
				scrollbarX: {
					thumb: {},
					track: {}
				},
				scrollbarY: {
					thumb: {},
					track: {}
				},
				move: {
					axis: null,
					mouse: {},
					position: {}
				}
			}
			
			this._wrapInContainer();
			this.refresh();
			this._attachEvents();
			
		},
		
		/* Wrap element in container - creates elements */
		_wrapInContainer: function() {
			
			this._id = $[scrollbar].count++;
			this._overflowX = this.element.css("overflow-x");
			this._overflowY = this.element.css("overflow-y");
			this._scrollX = this._overflowX in { auto:1, scroll:1 } ? true : false;
			this._scrollY = this._overflowY in { auto:1, scroll:1 } ? true : false;
			this._outerHeight = this.element.outerHeight();
			this._outerWidth = this.element.outerWidth();
			
			this.$overview = this.element.addClass("ui-scrollbar-overview");
			this.$container = $("<div class='ui-scrollbar ui-scrollbar-default "+this.options.classes+"' id='scrollbar-"+this._id+"' />").toggleClass("ui-scrollbar-overlay", this.options.overlay);
			this.$viewport = $("<div class='ui-scrollbar-viewport' />");
			this.$scrollbarX = $("<div class='ui-scrollbar-scrollbarX'><div class='ui-scrollbar-track'><div class='ui-scrollbar-thumb'></div></div></div>");
			this.$scrollbarY = $("<div class='ui-scrollbar-scrollbarY'><div class='ui-scrollbar-track'><div class='ui-scrollbar-thumb'></div></div></div>");
			
			
			this.$overview.after(this.$container);
			this.$overview.remove();
			this.$container.append(this.$viewport);
			this.$viewport.append(this.$overview);
			if(this._scrollY) { this.$container.append(this.$scrollbarY); }
			if(this._scrollX) { this.$container.append(this.$scrollbarX); }
			this._trackXWidth = this.$scrollbarX.find(".ui-scrollbar-track").width();
			this._trackYHeight = this.$scrollbarY.find(".ui-scrollbar-track").height();
			this._thumbXWidth = this.$scrollbarX.find(".ui-scrollbar-thumb").width();
			this._thumbYHeight = this.$scrollbarY.find(".ui-scrollbar-thumb").height();
			
		},
		
		_setSize: function() {
			
			if(this._scrollY) {
				this.$overview.css("top", -this.settings.scrollbarY.pos);
				this.$scrollbarY.css("height", this.settings.scrollbarY.track.height);
				this.$scrollbarY.find(".ui-scrollbar-track").css("height", this.settings.scrollbarY.track.height);
				this.$scrollbarY.find(".ui-scrollbar-thumb").css({
					"top": this.settings.scrollbarY.pos / this.settings.scrollbarY.ratio,
					"height": this.settings.scrollbarY.thumb.height
				});
			}
			
			if(this._scrollX) {
				this.$overview.css("left", -this.settings.scrollbarX.pos);
				this.$scrollbarX.css("width", this.settings.scrollbarX.track.width);
				this.$scrollbarX.find(".ui-scrollbar-track").css("width", this.settings.scrollbarX.track.width);
				this.$scrollbarX.find(".ui-scrollbar-thumb").css({
					"left": this.settings.scrollbarX.pos / this.settings.scrollbarX.ratio,
					"width": this.settings.scrollbarX.thumb.width
				});
			}
			
		},
		
		_attachEvents: function() {
			
			if(this._scrollY) {
				this.$scrollbarY.find(".ui-scrollbar-thumb").bind("mousedown", { axis: "y", obj: this }, this._onStart);
				this.$scrollbarY.find(".ui-scrollbar-track").bind("mouseup", { axis: "y", obj: this }, this._onDrag);
				if(this.options.scroll) { 
					this.$container.bind("DOMMouseScroll mousewheel", { axis: "y", obj: this }, this._onWheel);
				}
			}
			
			if(this._scrollX) {
				this.$scrollbarX.find(".ui-scrollbar-thumb").bind("mousedown", { axis: "x", obj: this }, this._onStart);
				this.$scrollbarX.find(".ui-scrollbar-track").bind("mouseup", { axis: "x", obj: this }, this._onDrag);
				if(this.options.scroll) {
					this.$container.bind("DOMMouseScroll mousewheel", { axis: "x", obj: this }, this._onWheel);
				}
			}
			
		},
		
		_onStart: function(event) {
			
			var obj = event.data.obj;
			obj.settings.move.axis = event.data.axis;
			
			if(obj.settings.move.axis == "y") {
				obj.settings.move.mouse.start = event.pageY;
				var thumbTop = parseInt(obj.$scrollbarY.find(".ui-scrollbar-thumb").css("top"));
				obj.settings.move.position.start = thumbTop == "auto" ? 0 : thumbTop;
				$(document).bind("mousemove touchmove", { axis: "y", obj: obj }, obj._onDrag);
				$(document).bind("mouseup touchend", { axis: "y", obj: obj }, obj._onEnd);
				obj.$scrollbarY.find(".ui-scrollbar-thumb").bind("mouseup touchend", { axis: "y", obj: obj }, obj._onEnd);
			}
			
			if(obj.settings.move.axis == "x") {
				obj.settings.move.mouse.start = event.pageX;
				var thumbLeft = parseInt(obj.$scrollbarX.find(".ui-scrollbar-thumb").css("left"));
				obj.settings.move.position.start = thumbLeft == "auto" ? 0 : thumbLeft;
				$(document).bind("mousemove touchmove", { axis: "x", obj: obj }, obj._onDrag);
				$(document).bind("mouseup touchend", { axis: "x", obj: obj }, obj._onEnd);
				obj.$scrollbarX.find(".ui-scrollbar-thumb").bind("mouseup touchend", { axis: "x", obj: obj }, obj._onEnd);
			}
			
			return false;
			
		},
		
		_onEnd: function(event) {
			
			var obj = event.data.obj;
			
			if(obj.settings.move.axis == "y") {
				$(document).unbind('mousemove touchmove', obj._onDrag);
				$(document).unbind('mouseup touchend', obj._onEnd);
				obj.$scrollbarY.find(".ui-scrollbar-thumb").unbind('mouseup touchend', obj._onEnd);
			}
			
			if(obj.settings.move.axis == "x") {
				$(document).unbind('mousemove touchmove', obj._onDrag);
				$(document).unbind('mouseup touchend', obj._onEnd);
				obj.$scrollbarX.find(".ui-scrollbar-thumb").unbind('mouseup touchend', obj._onEnd);
			}
			
			return false;
			
		},
		
		_onDrag: function(event) {
			
			var obj = event.data.obj;
			if(!obj.settings.move.axis)
				obj.settings.move.axis = event.data.axis;
			
			if(obj.settings.move.axis == "y") {
				if(!(obj.settings.overview.ratioY >= 1)) {
					obj.settings.move.position.current = Math.min(
						obj.settings.scrollbarY.track.height - obj.settings.scrollbarY.thumb.height,
						Math.max(0, (obj.settings.move.position.start + (event.pageY - obj.settings.move.mouse.start)))
					);
					obj.settings.scrollbarY.pos = obj.settings.move.position.current * obj.settings.scrollbarY.ratio;
					obj.$overview.css("top", -obj.settings.scrollbarY.pos);
					obj.$scrollbarY.find(".ui-scrollbar-thumb").css("top", obj.settings.move.position.current);
				}
			}
			
			if(obj.settings.move.axis == "x") {
				if(!(obj.settings.overview.ratioX >= 1)) {
					obj.settings.move.position.current = Math.min(
						obj.settings.scrollbarX.track.width - obj.settings.scrollbarX.thumb.width,
						Math.max(0, (obj.settings.move.position.start + (event.pageX - obj.settings.move.mouse.start)))
					);
					obj.settings.scrollbarX.pos = obj.settings.move.position.current * obj.settings.scrollbarX.ratio;
					obj.$overview.css("left", -obj.settings.scrollbarX.pos);
					obj.$scrollbarX.find(".ui-scrollbar-thumb").css("left", obj.settings.move.position.current);
				}
			}
			
			return false;
			
			
		},
		
		_onWheel: function(event) {
			
			var obj = event.data.obj;
			if(event.originalEvent.wheelDeltaX)
				obj.settings.move.axis = 'x';
			else if(event.originalEvent.wheelDeltaY)
				obj.settings.move.axis = 'y';
			else if(!obj.settings.move.axis)
				obj.settings.move.axis = event.data.axis;
			
			if(obj.settings.move.axis == "y") {
				if(!(obj.settings.overview.ratioY >= 1)) {
					event = $.event.fix(event || window.event);
					var delta = event.wheelDelta ? event.wheelDelta/120 : -event.detail/3;
					obj.settings.scrollbarY.pos -= delta * obj.options.wheel;
					obj.settings.scrollbarY.pos = Math.min(
						obj.settings.overview.height - obj.settings.viewport.height,
						Math.max(0, obj.settings.scrollbarY.pos)
					);
					
					if(obj.options.animate) {
						obj.$scrollbarY.find(".ui-scrollbar-thumb").stop().animate({ "top": obj.settings.scrollbarY.pos / obj.settings.scrollbarY.ratio }, obj.options.animate.duration, obj.options.animate.easing);
						obj.$overview.stop().animate({ "top": -obj.settings.scrollbarY.pos }, obj.options.animate.duration, obj.options.animate.easing);
					}
					else {
						obj.$scrollbarY.find(".ui-scrollbar-thumb").css("top", obj.settings.scrollbarY.pos / obj.settings.scrollbarY.ratio);
						obj.$overview.css("top", -obj.settings.scrollbarY.pos);
					}
					if(obj.settings.scrollbarY.pos > 0 && obj.settings.scrollbarY.pos < (obj.settings.overview.height - obj.settings.viewport.height))
						event.preventDefault();
				}
			}
			
			if(obj.settings.move.axis == "x") {
				if(!(obj.settings.overview.ratioX >= 1)) {
					event = $.event.fix(event || window.event);
					var delta = event.wheelDelta ? event.wheelDelta/120 : -event.detail/3;
					obj.settings.scrollbarX.pos -= delta * obj.options.wheel;
					obj.settings.scrollbarX.pos = Math.min(
						obj.settings.overview.width - obj.settings.viewport.width,
						Math.max(0, obj.settings.scrollbarX.pos)
					);
					
					if(obj.options.animate) {
						obj.$scrollbarX.find(".ui-scrollbar-thumb").stop().animate({ "left": obj.settings.scrollbarX.pos / obj.settings.scrollbarX.ratio }, obj.options.animate.duration, obj.options.animate.easing);
						obj.$overview.stop().animate({ "left": -obj.settings.scrollbarX.pos }, obj.options.animate.duration, obj.options.animate.easing);
					}
					else {
						obj.$scrollbarX.find(".ui-scrollbar-thumb").css("left", obj.settings.scrollbarX.pos / obj.settings.scrollbarX.ratio);
						obj.$overview.css("left", -obj.settings.scrollbarX.pos);
					}
					if(obj.settings.scrollbarX.pos > 0 && obj.settings.scrollbarX.pos < (obj.settings.overview.width - obj.settings.viewport.width))
						event.preventDefault();
				}
			}
			
		},
		
		_scrollTo: function(y, x) {
			
			y = y || typeof y == "number" ? y : null;
			x = x || typeof x == "number" ? x : null;
			
			if(y || y === 0) {
				var posY = Math.min(
					this.settings.scrollbarY.track.height - this.settings.scrollbarY.thumb.height,
					Math.max(0, y / this.settings.scrollbarY.ratio)
				);
				this.settings.scrollbarY.pos = posY * this.settings.scrollbarY.ratio;
				this.$overview.css("top", -this.settings.scrollbarY.pos);
				this.$scrollbarY.find(".ui-scrollbar-thumb").css("top", posY);
			}
			
			if(x || x === 0) {
				var posX = Math.min(
					this.settings.scrollbarX.track.width - this.settings.scrollbarX.thumb.width,
					Math.max(0, x / this.settings.scrollbarX.ratio)
				);
				this.settings.scrollbarX.pos = posX * this.settings.scrollbarX.ratio;
				this.$overview.css("left", -this.settings.scrollbarX.pos);
				this.$scrollbarX.find(".ui-scrollbar-thumb").css("left", posX);
			}
			
		},
		
		
		
		/* PUBLIC METHODS */
		
		/**
		 * Refresh state, call this on content change
		 * 
		 * 
		 * refresh()
		 *   -> Only refresh
		 * 
		 * refresh(offsetX[, offsetY])
		 *   -> Refresh and scroll to [x,y] coordinates
		 * 
		 * refresh(selector)
		 *   -> Refresh and scroll to selector first element position
		 * 
		 * refresh(jQuery object)
		 *   -> Refresh and scroll to jQuery object position
		 */
		refresh: function(scrollToX, scrollToY) {
			
			this.$container.width(this._outerWidth);
			this.$container.height(this._outerHeight);
			this.$viewport.width(this.options.overlay ? this._outerWidth : this._outerWidth - this.$scrollbarY.outerWidth());
			this.$viewport.height(this.options.overlay ? this._outerHeight : this._outerHeight - this.$scrollbarX.outerHeight());
			
			if(this._scrollY) {
				this.$overview.css({ height: 'auto' });
				this.settings.viewport.height = this.$viewport.outerHeight();
				this.settings.overview.height = this.$overview.outerHeight();
				if(this._scrollX) {
					this.$overview.css({ width: 'auto' });
					this.settings.viewport.width = this.$viewport.outerWidth();
					this.settings.overview.width = this.$overview.outerWidth();
					this.settings.overview.ratioX = this.settings.viewport.width / this.settings.overview.width;
				}
				this.settings.overview.ratioY = this.settings.viewport.height / this.settings.overview.height;
				this.settings.scrollbarY.offsetHeight = this.$scrollbarY.outerHeight() - this.$scrollbarY.height();
				this.settings.scrollbarY.track.height = this._trackYHeight == 0 ?
					this.settings.viewport.height - this.settings.scrollbarY.offsetHeight - (this._scrollX && this.options.overlay && this.settings.overview.ratioX < 1 ? this.$scrollbarX.outerHeight() : 0) :
					this.$scrollbarY.find(".ui-scrollbar-track").height();
				this.settings.scrollbarY.thumb.height = this._thumbYHeight == 0 ?
					Math.min(this.settings.scrollbarY.track.height, Math.max(0, (this.settings.scrollbarY.track.height * this.settings.overview.ratioY))) :
					this.$scrollbarY.find(".ui-scrollbar-thumb").height();
				this.settings.scrollbarY.ratio = (this.settings.overview.height - this._trackYHeight) / this.settings.scrollbarY.track.height;
				
				this.settings.scrollbarY.pos = 0;
				
				this.$scrollbarY.toggleClass("disabled ui-scrollbar-disabled", this.settings.overview.ratioY >= 1);
			}
			
			if(this._scrollX) {
				this.$overview.css({ width: 'auto' });
				this.settings.viewport.width = this.$viewport.outerWidth();
				this.settings.overview.width = this.$overview.outerWidth();
				if(this._scrollY && !this.settings.overview.ratioY) {
					this.$overview.css({ height: 'auto' });
					this.settings.viewport.height = this.$viewport.outerHeight();
					this.settings.overview.height = this.$overview.outerHeight();
					this.settings.overview.ratioY = this.settings.viewport.height / this.settings.overview.height;
				}
				this.settings.overview.ratioX = this.settings.viewport.width / this.settings.overview.width;
				this.settings.scrollbarX.offsetWidth = this.$scrollbarX.outerWidth() - this.$scrollbarX.width();
				this.settings.scrollbarX.track.width = this._trackXWidth == 0 ?
					this.settings.viewport.width - this.settings.scrollbarX.offsetWidth - (this._scrollY && this.options.overlay && this.settings.overview.ratioY < 1 ? this.$scrollbarY.outerWidth() : 0) :
					this.$scrollbarX.find(".ui-scrollbar-track").width();
				this.settings.scrollbarX.thumb.width = this._thumbXWidth == 0 ?
					Math.min(this.settings.scrollbarX.track.width, Math.max(0, (this.settings.scrollbarX.track.width * this.settings.overview.ratioX))) :
					this.$scrollbarX.find(".ui-scrollbar-thumb").width();
				this.settings.scrollbarX.ratio = (this.settings.overview.width - this._trackXWidth) / this.settings.scrollbarX.track.width;
				this.settings.scrollbarX.pos = 0;
				
				this.$scrollbarX.toggleClass("disabled ui-scrollbar-disabled", this.settings.overview.ratioX >= 1);
			}
			
			this._setSize();
			
			if(this.options.autohide) {
				this.$container.unbind('mouseenter touchstart mouseleave touchend');
				if(this._scrollY && !this.$scrollbarY.hasClass("ui-scrollbar-disabled")) {
					this.$scrollbarY.hide();
					var $scrollbarY = this.$scrollbarY;
					this.$container
						.bind('mouseenter touchstart', function(){ $scrollbarY.stop(true, true).fadeIn(400); })
						.bind('mouseleave touchend', function(){ $scrollbarY.stop(true, true).delay(500).fadeOut(600); });
				}
				if(this._scrollX && !this.$scrollbarX.hasClass("ui-scrollbar-disabled")) {
					this.$scrollbarX.hide();
					var $scrollbarX = this.$scrollbarX;
					this.$container.hover(
						function(){ $scrollbarX.stop(true, true).fadeIn(400); },
						function(){ $scrollbarX.stop(true, true).delay(500).fadeOut(600); }
					);
				}
			}
			
			if((scrollToY || typeof scrollToY == "number") || (scrollToX || typeof scrollToX == "number"))
				this.scrollTo(scrollToY, scrollToX);
			
		},
		
		
		/**
		 * Scroll to coordinates or element
		 * 
		 * 
		 * scrollTo(offsetX[, offsetY])
		 *   -> Scroll to [x,y] coordinates
		 * 
		 * scrollTo(selector)
		 *   -> Scroll to selector first element position
		 * 
		 * scrollTo(jQuery object)
		 *   -> Scroll to jQuery object position
		 */
		scrollTo: function(to, x) {
			
			switch(typeof to) {
				case "number":
					this._scrollTo(to, x);
					break;
				
				case "string":
					var $elem = this.$overview.find(to);
					if(!$elem.length)
						return false;
					var pos = $elem.first().position();
					this._scrollTo(pos.top, pos.left);
					break;
				
				case "object":
					var $elem = this.$overview.find(to[0]);
					if(!$elem.length)
						return false;
					var pos = $elem.first().position();
					this._scrollTo(pos.top, pos.left);
					break;
				
			}
			
		}
		
	});
	
	$[scrollbar].count = 0;
	
})(jQuery, 'scrollbar');