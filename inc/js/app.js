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
			App.Gallery.init();
			$(".last img").load(function(){
				App.DataBind.removeLoading();
				App.DataBind.anime();
			});
		}
	});

});

