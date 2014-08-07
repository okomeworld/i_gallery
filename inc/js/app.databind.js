/**
 * データとフィルター機能を管理
 */

App.DataBind = (function(window,$){

	// addSelectList用の設定項目
	// App.Configとか作ってまとめたほうがよさげ
	var SELECT_LIST_CONFIGS = [
		{
			'attr_key'        : 'item_category',
			'target_selector' : '#category',
		},
		{
			'attr_key'        : 'member_name',
			'target_selector' : '#name',
		}
	];

	var _DataBind = {

		// 初期化
		init: function(items){
			if(!items instanceof App.Items) {
				throw ReferenceError('items is not App.Items instance');
			}

			this.items = items;

			this.display();
			this.addSelectList();
		},

		// フィルタリング機能をDOMに実装
		implement_change : function(){
			var that = this;

			var $name = $('#name');
			var $category = $('#category');

			var callback = function(){
				var conditions = {};
				if($name.val() != 'all') conditions['member_name'] = $name.val();
				if($category.val() != 'all') conditions['item_category'] = $category.val();
	
				that.items.filter(conditions);
				console.log(that.items);

				that.display();
			}

			$name.on('change submit', callback);
			$category.on('change', callback);

		},

		// データリストをレンダリング
		display: function(){
			var that = this;
			var items_data = this.items.get_all();

			console.log(items_data);
			var $_list = $('#gallery');
			$_list.empty();
			items_data.forEach(function(item){
				$_list.append(
					'<li class="box">'
					+'<div class="caption"><a href="inc/img/b/' + item.item_src + '" class="expand"><img src="inc/img/t/' + item.item_src + '" /></a></div>'
					+'<div class="capture">' + item.member_name + '<br />' + item.item_category + '</div>'
					+'</li>'
				);
			});

			this.addClassLastBox();
			$(".last img").load(function(){
				that.removeLoading();
				that.anime();
				that.preload();
			});

		},

		// フィルタリングのプルダウンをレンダリング
		addSelectList : function(){
			var that = this;

			SELECT_LIST_CONFIGS.forEach(function(config){
				var $target = $(config.target_selector);
				var all_attributes = that.items.get_all_attributes(config.attr_key);

				all_attributes.forEach(function(attribute){
					$target.append("<option value='" + attribute + "'>" + attribute + "</option>");
				});
			});

		},

		// レンダリングしたデータ一覧の末にclassを追加
		addClassLastBox :function(){
			var $box_last = $('.box:last-child');
			$box_last.addClass('last');
		},

		// CSS3アニメーションのトリガーとなるクラスを追加
		anime: function(){
			var $box = $('.box');
			$box.addClass('anime_in');
		},

		// ローディング画面を表示 
		showLoading: function(){
			var $loading = $('#loading');
			$loading.show();
		},

		// ローディング画面を消す
		removeLoading: function(){
			var $loading = $('#loading');
			$loading.fadeOut();
		},

		// 大画像をプリロード
		preload: function(){
			$('.expand img').each(function() {
				var src = $(this).attr('src');
				var src = src.replace('/t/','/b/')
				$('<img />').attr('src', src);
			});
		},
	}

	return _DataBind;

})(this,jQuery);
