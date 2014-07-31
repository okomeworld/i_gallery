$(function(){

	var JSON_PATH = 'inc/data/data.json';

	App.DataBind.init(JSON_PATH);
	App.DataBind.change.init(JSON_PATH);
	App.Gallery.init();

});

