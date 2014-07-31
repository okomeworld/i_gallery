/**
 * データとフィルター機能を管理
 */

App.DataBind = (function(window,$){

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

		init: function(){
			var that = this;

			$.ajax({
				url: '/inc/data/data.json',
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
					});
				}
			});
		},

		change:{

			init: function(){
				var nameAlias = App.DataBind;
				var that = this;
				var $name = $('#name');
				var $category = $('#category');

				$name .on('change submit',function(){
					var value = $(this).val();
					var othrValue = $category.val();
					nameAlias.showLoading();
					that.ajax(value,'member_name',othrValue,'item_category',nameAlias);
				});

				$category.on('change',function(){
					var value = $(this).val();
					var othrValue = $name.val();
					nameAlias.showLoading();
					that.ajax(value,'item_category',othrValue,'member_name',nameAlias);
				});
			},

			ajax: function(value,property,othrValue,otherProperty,nameAlias){
				var that = this;

				$.ajax({
					url: '/inc/data/data.json',
					type: 'GET',
					cache: false,
					dataType: 'json',
					success: function(json){
						if(othrValue == 'all'){
							that.case_single(json,value,property,nameAlias);
						}else{
							that.case_dual(json,value,property,othrValue,otherProperty,nameAlias);
						}
						nameAlias.addClassLastBox();
					},
					complete: function(){
						var $lastImg = $(".last img");
						$lastImg.load(function(){
							nameAlias.removeLoading();
							nameAlias.anime();
						});
					}
				});
			},

			case_single: function(data,value,property,nameAlias){
				if(value == 'all'){
					nameAlias.getDataAll(data);
				}else{
					nameAlias.getDataFilter(data,value,property);
				}
			},

			case_dual: function(data,value,property,othrValue,otherProperty,nameAlias){
				if(value == 'all' && othrValue == 'all'){
					nameAlias.getDataAll(data);
				}else if(value == 'all' || othrValue == 'all'){
					nameAlias.getDataFilter(data,othrValue,otherProperty);
				}else{
					nameAlias.getDataPluralFilter(data,value,property,othrValue,otherProperty);
				}
			}
		},

		getDataAll: function(data){
			var dataFilter = data;
			this.display(dataFilter);
		},

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

		display: function(dataFilter){
			var len = dataFilter.length;
			var $_list = $('#gallery');
			$_list.empty();
			for (var i = 0; i < len; i++) {
				new _Item(dataFilter,i,$_list);
			};
		},

		addClassLastBox :function(){
			var $box_last = $('.box:last-child');
			$box_last.addClass('last');
		},

		anime: function(){
			var $box = $('.box');
			$box.addClass('anime_in');
		},

		showLoading: function(){
			var $loading = $('#loading');
			$loading.show();
		},

		removeLoading: function(){
			var $loading = $('#loading');
			$loading.fadeOut();
		},

		addSelectList:{

			init: function(data){
				this.util(data,'item_category','#category')
				this.util(data,'member_name','#name')
			},

			util: function(data, category, selector){
				var len = data.length;
				var array = [];
				for (var i = 0; i < len; i++) {
					array.push(data[i][category]);
				};

				var array = array.filter(function (x, i, self) {
					return self.indexOf(x) === i && i !== self.lastIndexOf(x);
				});

				var len = array.length
				for (var i = 0; i < len; i++){
					var $selector = $(selector)
					$selector.append("<option value='" + array[i] + "'>" + array[i] + "</option>");
				}
			}
		},
	}

	return _DataBind;

})(this,jQuery);
