$(function(){

	$.ajax({
		url: '/inc/data/data.json',
		type: 'GET',
		cache: false,
		dataType: 'json',
		success: function(json){
			App.DataBind.init(json);
		},
		complete: function(json){
			App.DataBind.anime();
			App.Gallery.init();
			App.DataBind.removeLoading();
		}
	});

	window.onload = function(){
	}

});

