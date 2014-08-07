$(function(){

	var JSON_PATH = 'inc/data/data.json';

	var items = new App.Items(JSON_PATH);
	App.DataBind.init(items);
	App.DataBind.implement_change();
	App.Gallery.init();

});

