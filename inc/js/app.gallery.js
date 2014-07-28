/**
 * ギャラリー機能を管理
 */

App.Gallery = (function(window,$){

	var _Gallery = {

		init: function(){
			var that = this;
			var $document = $(document);
			this.preload();

			$document.on('click', '.expand', function(e) {
				e.preventDefault();
				var $self = $(this);
				that.addImg($self);
			});

			$document.on('click', '.exBox', function(e) {
				e.preventDefault();
				var $self = $(this);
				that.removeImg($self);
			});
		},

		preload: function(){
			$('.expand').each(function() {
				$('<img />').attr('src', $(this).attr('src'));
			});
		},

		addImg: function($self){
			var $window = $(window);
			var $body = $('body');
			var src = $self.attr('href');
			var y = $window.scrollTop();
			var w_height = $window.height();
			var b_height = $body.height();
			if(w_height > b_height){
				var b_height = w_height;
			}

			$body.append(
				'<div class="exBox" style="height:' + b_height + 'px;">'
				+ '<img src="' + src + '" />'
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
				$self.css({marginTop: value,height: img_height}).addClass('anime_in');
			});
		},

		removeImg: function($self){
			$self.remove();
		}
	}

	return _Gallery

})(this,jQuery);
