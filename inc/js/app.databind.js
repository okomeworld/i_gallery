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

		init: function(json){
			var data = json;
			this.getDataAll(data);
			this.change(data);
			this.addSelectList.init(data);
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

		change: function(data){
			var that = this;
			var $name = $('#name');
			var $category = $('#category');

			$name .on('change submit',function(){
				var value = $(this).val();
				var valueCategory = $category.val();
				if(valueCategory == 'all'){
					_case(data,'member_name',value);
				}else{
					_case2(data,value,'member_name',valueCategory,'item_category');
				}
				that.anime();
			})

			$category.on('change',function(){
				var value = $(this).val();
				var valueName = $name .val();
				if(valueName == 'all'){
					_case(data,'item_category',value);
				}else{
					_case2(data,value,'item_category',valueName,'member_name');
				}
				that.anime();
			})

			function _case(data,subject,value){
				if(value == 'all'){
					that.getDataAll(data);
				}else{
					that.getDataFilter(data,value,subject);
				}
			}

			function _case2(data,value,subject,_value,_subject){
				if(value == 'all' && _value == 'all'){
					that.getDataAll(data);
				}else if(value == 'all' || _value == 'all'){
					that.getDataFilter(data,_value,_subject);
				}else{
					that.getDataPluralFilter(data,value,subject,_value,_subject);
				}
			}
		},

		getDataAll: function(data){
			var dataFilter = data;
			this.display(dataFilter);
		},

		getDataFilter: function(data,value,subject){
			var dataAll = data;
			var dataFilter = [];
			var str = new RegExp(value,'i');
			dataFilter = dataAll.filter(function(item,index){
				if(item[subject].match(str)){
					return true;
				};
			});
			this.display(dataFilter);
		},

		getDataPluralFilter: function(data,value,subject,_value,_subject){
			var dataAll = data;
			var dataFilter = [];
			var _str = new RegExp(_value,'i');
			var str = new RegExp(value,'i');
			dataFilter = dataAll.filter(function(item,index){
				if(item[_subject].match(_str)){
					return true;
				};
			}).filter(function(item,index){
				if (item[subject].match(str)){
					return true;
				};
			});
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

		anime: function(){
			var $box = $('.box');
			$box.addClass('anime_in');
		},

		removeLoading: function(){
			$('#loading').fadeOut();
		}
	}

	return _DataBind;

})(this,jQuery);
