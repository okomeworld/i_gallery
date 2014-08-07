/**
 * データを扱うクラス。いわゆるモデル
 */
;(function($){
	
	App.Items = function(json_url){

		var that = this;

		// 同期通信でデータ取得する
		$.ajaxSetup({ async : false });

		$.getJSON(json_url, function(data){
			that._gettable_data = that._data = data;
			that.init();
		});

		// 非同期通信の状態に戻す
		$.ajaxSetup({ async : true });
	}

	App.Items.prototype = {

		init : function(){
			this.first_index = 0;
			this.last_index  = this.get_all().length - 1;

			this.set_index(this.first_index); 
		},

		get : function(index){
			index = this._adjust_index(index);
			return this._gettable_data[index];
		},

		get_all : function(){
			return this._gettable_data;
		},

		set_index : function(index){
			this._index = this._adjust_index(index);
		},

		get_current_index : function(){
			return this._index;
		},

		get_next_index : function(){
			return this._adjust_index(this._index + 1);
		},

		get_prev_index : function(){
			return this._adjust_index(this._index - 1);
		},

		current : function(){
			return this.get(this.get_current_index());
		},

		next : function(){
			this.set_index(this.get_next_index());
			return this.get(this.get_current_index());
		},

		prev : function(){
			this.set_index(this.get_prev_index());
			return this.get(this.get_current_index());
		},

		has_next : function(){
			return (this.get_current_index() < this.last_index);
		},

		has_prev : function(){
			return (this.get_current_index() > this.first_index);
		},

		get_all_attributes : function(attr_key){
			var that = this;
			return $.unique(this._data.map(function(val){
				return val[attr_key];
			}));
		},

		filter : function(conditions){
			var that = this;
			var result_data = this._data;

			if(conditions) {
				for (var key in conditions) {
					result_data = result_data.filter(function(val){
						return (val[key] == conditions[key]);
					});
				}
			}

			this._gettable_data = result_data;
			this.init();

			return this;
		},

		_adjust_index : function(index){
			var first = 0;
			var last  = this.get_all().length - 1;
			return Math.min(last, Math.max(first, index)); 
		}
	};

})(jQuery);
