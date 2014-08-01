/**
 * ギャラリー機能を管理
 */

App.Gallery = (function(window,$){

	var _Gallery = {

		init: function(){
			var that = this;
			var $document = $(document);

			$document.on('click', '.expand', function(e) {
				e.preventDefault();
				var $self = $(this);
				$self.parent().parent().addClass('current');
				that.addImg($self);
			});

			$document.on('click', '.exBox img', function(e) {
				e.preventDefault();
				var $self = $(this).parent().parent();
				$('.current').removeClass('current');
				that.removeImg($self);
			});

			$document.on('click', '.next', function(e) {
				e.preventDefault();
				that.sendPage('next');
			});

			$document.on('click', '.prev', function(e) {
				e.preventDefault();
				that.sendPage('prev');
			});

		},

		sendPage: function(send){
			var $current = $('.current');
			if(send === 'next'){
				var $send = $current.next();
				var $sendA = $current.next().find('a');
			}else if(send === 'prev'){
				var $send = $current.prev();
				var $sendA = $current.prev().find('a');
			}
			$('.exBox').remove();

			this.addImg($sendA);

			$current.removeClass('current');
			$send.addClass('current');
		},

		addImg: function($self){
			var $window = $(window);
			var $body = $('body');
			var $currentBox = $self.parent().parent();
			var src = $self.attr('href');
			var y = $window.scrollTop();
			var w_height = $window.height();
			var b_height = $body.height();
			if(w_height > b_height){
				var b_height = w_height;
			}

			$body.append(
				'<div class="exBox" style="height:' + b_height + 'px;">'
				+ '<div><a href="#" class="btn prev">PREV</a><a href="#" class="btn next">NEXT</a><img src="' + src + '" /></div>'
				+ '</a>'
			);

			$('.exBox img').on('load', function(event) {
				var $self = $(this);
				var img_height = $self.height();
				var value = ( w_height - img_height )/2 + y;
				if(w_height < img_height){
					var value = y;
					var img_height = w_height;
				}
				$('.exBox').css({paddingTop: value});
				$self.css({height: img_height}).addClass('anime_in');
			});

			if(!$currentBox.next().size()){
				$('.next').hide();
			}else if(!$currentBox.prev().size()){
				$('.prev').hide();
			}

		},

		removeImg: function($self){
			$self.remove();
		}
	}

	return _Gallery

})(this,jQuery);
