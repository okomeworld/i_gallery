/**
 * ギャラリー機能を管理
 */

App.Gallery = (function(window,$){

	var _Gallery = {

		//初期化
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

		//画像送りの処理
		sendPage: function(send){
			var $current = $('.current');
			//NEXTかPREVかの判定
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

		//拡大画像のDOMを生成
		addImg: function($self){
			var $window = $(window);
			var $body = $('body');
			var $currentBox = $self.parent().parent();
			var src = $self.attr('href');
			var y = $window.scrollTop();
			var w_height = $window.height();
			var b_height = $body.height();

			//画面の高さよりもページの高さが低い場合の処理
			if(w_height > b_height){
				var b_height = w_height;
			}
			$body.append(
				'<div class="exBox" style="height:' + b_height + 'px;">'
				+ '<div><a href="#" class="btn prev">PREV</a><a href="#" class="btn next">NEXT</a><img src="' + src + '" /></div>'
				+ '</a>'
			);

			//画像を中央に配置する処理
			$('.exBox img').on('load', function(event) {
				var $self = $(this);
				var img_height = $self.height();
				var value = ( w_height - img_height )/2 + y;
				//画面の高さよりも画像が大きい場合の処理
				if(w_height < img_height){
					var value = y;
					var img_height = w_height;
				}
				$('.exBox').css({paddingTop: value});
				$self.css({height: img_height}).addClass('anime_in');
			});

			//前の画像、次の画像がない場合にボタンを非表示
			if(!$currentBox.next().size()){
				$('.next').hide();
			}else if(!$currentBox.prev().size()){
				$('.prev').hide();
			}

		},

		//拡大画像を削除
		removeImg: function($self){
			$self.remove();
		}
	}

	return _Gallery

})(this,jQuery);
