var subView = { 
	rel:'content',
	onLoaded: function() 
	{
		welcome.setBreadcrumb([]);
	},
};
var welcome = {
	setBreadcrumb: function(arr){
		$('#site-content .wrap ul').empty().append('<li><a href="#/welcome">Welcome</a></li>');
		for(var i = 0 ; i < arr.length ; i++){
			$('#site-content .wrap ul').append('<li>'+arr[i]+'</li>');
		}
		window.document.title = arr[arr.length-1];
	},
}