;(function($){
	
	App.Items = function(json_url){

		var that = this;

		this.attribute_keys = {
			'category' : 'item_category',
			'name'     : 'item_name',
		};

		$.getJSON(json_url, function(data){
			that._gettable_data = that._data = data;
			that.init();
		});
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

		get_all_attributes : function(attr_type){
			var that = this;
			return $.unique(this._data.map(function(val){
				return val[that.attribute_keys[attr_type]];
			}));
		},

		filter_by_attibutes : function(attrs){
			var that = this;
			var result_data = this._data;
			
			for (var key in attrs) {
				var attribute_key = that.attribute_keys[key];
				if (!attribute_key) continue;
				result_data = result_data.filter(function(val){
					return (val[attribute_key] == attrs[key]);
				});
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
