/**
 * データとフィルター機能を管理
 */

App.DataBind = (function(window,$){

	//オブジェクトを管理
	function _Item(dataFilter,i,$_list){
		this.member_id = dataFilter[i].member_id;
		this.member_name = dataFilter[i].member_name;
		this.item_id = dataFilter[i].item_id;
		this.item_name = dataFilter[i].item_name;
		this.item_category = dataFilter[i].item_category;
		this.item_src = dataFilter[i].item_src;
		this.addList($_list);
	}

	_Item.prototype.addList = function($_list){
		$_list.append(
			'<li class="box">'
			+'<div class="caption"><a href="inc/img/b/' + this.item_src + '" class="expand"><img src="inc/img/t/' + this.item_src + '" /></a></div>'
			+'<div class="capture">' + this.member_name + '<br />' + this.item_category + '</div>'
			+'</li>'
		);
	}

	var _DataBind = {

		//初期化処理
		init: function(jsonPath){
			var that = this;

			$.ajax({
				url: jsonPath,
				type: 'GET',
				cache: false,
				dataType: 'json',
				success: function(json){
					that.getDataAll(json);
					that.addSelectList.init(json);
					that.addClassLastBox();
				},
				complete: function(json){
					var $lastImg = $(".last img");

					$lastImg.load(function(){
						that.removeLoading();
						that.anime();
						that.preload();
					});
				}
			});
		},

		//セレクトボックスが変更された時の処理
		change:{

			//初期化
			init: function(jsonPath){
				var _nameAlias = App.DataBind;
				var that = this;
				var $name = $('#name');
				var $category = $('#category');

				$name .on('change submit',function(){
					var value = $(this).val();
					var othrValue = $category.val();
					_nameAlias.showLoading();
					that.ajax(value,'member_name',othrValue,'item_category',_nameAlias,jsonPath);
				});

				$category.on('change',function(){
					var value = $(this).val();
					var othrValue = $name.val();
					_nameAlias.showLoading();
					that.ajax(value,'item_category',othrValue,'member_name',_nameAlias,jsonPath);
				});
			},

			//Ajax通信通訊時の処理
			ajax: function(value,property,othrValue,otherProperty,_nameAlias,jsonPath){
				var that = this;

				$.ajax({
					url: jsonPath,
					type: 'GET',
					cache: false,
					dataType: 'json',
					success: function(json){
						if(othrValue == 'all'){
							that.case_single(json,value,property,_nameAlias);
						}else{
							that.case_dual(json,value,property,othrValue,otherProperty,_nameAlias);
						}
						_nameAlias.addClassLastBox();
					},
					complete: function(){
						var $lastImg = $(".last img");
						$lastImg.load(function(){
							_nameAlias.removeLoading();
							_nameAlias.anime();
						});
					}
				});
			},

			//セレクトボックス単体ソートの場合の処理
			case_single: function(data,value,property,_nameAlias){
				if(value == 'all'){
					_nameAlias.getDataAll(data);
				}else{
					_nameAlias.getDataFilter(data,value,property);
				}
			},

			//セレクトボックス複数ソートの場合の処理
			case_dual: function(data,value,property,othrValue,otherProperty,_nameAlias){
				if(value == 'all' && othrValue == 'all'){
					_nameAlias.getDataAll(data);
				}else if(value == 'all' || othrValue == 'all'){
					_nameAlias.getDataFilter(data,othrValue,otherProperty);
				}else{
					_nameAlias.getDataPluralFilter(data,value,property,othrValue,otherProperty);
				}
			}
		},

		//全てのデータで配列を生成
		getDataAll: function(data){
			var dataFilter = data;
			this.display(dataFilter);
		},

		//セレクトボックス単体でソートした場合の配列を生成
		getDataFilter: function(data,value,property){
			var dataAll = data;
			var dataFilter = [];
			var str = new RegExp(value,'i');
			dataFilter = dataAll.filter(function(item,index){
				if(item[property].match(str)){
					return true;
				};
			});
			this.display(dataFilter);
		},

		//セレクトボックス複数でソートした場合の配列を生成
		getDataPluralFilter: function(data,value,property,othrValue,otherProperty){
			var dataAll = data;
			var dataFilter = [];
			var otherStr = new RegExp(othrValue,'i');
			var str = new RegExp(value,'i');
			dataFilter = dataAll.filter(function(item,index){
				if(item[otherProperty].match(otherStr)){
					return true;
				};
			}).filter(function(item,index){
				if (item[property].match(str)){
					return true;
				};
			});

			if(dataFilter.length === 0){
				this.removeLoading();
				alert('データがありません');
			}

			this.display(dataFilter);
		},

		//配列を受け取りオブジェクトをインスタンス化
		display: function(dataFilter){
			var len = dataFilter.length;
			var $_list = $('#gallery');
			$_list.empty();
			for (var i = 0; i < len; i++) {
				new _Item(dataFilter,i,$_list);
			};
		},

		//最後のボックスにクラスを追加
		addClassLastBox :function(){
			var $box_last = $('.box:last-child');
			$box_last.addClass('last');
		},

		//CSS3アニメーションのトリガーとなるクラスを追加
		anime: function(){
			var $box = $('.box');
			$box.addClass('anime_in');
		},

		//ローディング画面を表示
		showLoading: function(){
			var $loading = $('#loading');
			$loading.show();
		},

		//ローディング画面を非表示
		removeLoading: function(){
			var $loading = $('#loading');
			$loading.fadeOut();
		},

		//セレクトボックス内のoptionを生成
		addSelectList:{

			//初期化
			init: function(data){
				this.util(data,'item_category','#category')
				this.util(data,'member_name','#name')
			},

			//JSONデータよりセレクトボックス用の配列を生成
			util: function(data, category, selector){

				//特定の項目のみの配列を生成
				var len = data.length;
				var array = [];
				for (var i = 0; i < len; i++) {
					array.push(data[i][category]);
				};

				//重複した項目を削除
				var array = array.filter(function (x, i, self) {
					return self.indexOf(x) === i;
				});

				var len = array.length
				for (var i = 0; i < len; i++){
					var $selector = $(selector)
					$selector.append("<option value='" + array[i] + "'>" + array[i] + "</option>");
				}
			}
		},

		//大画像をプリロードする処理
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
