var sv;
var subView = {
	rel : 'primaryspace',
	onLoaded: function(){

	  $('.body-navigation').binus_body_navigation({
	      item_show: 4
	  });

	},
	onDefaultChild: function(){

	}
};	
var training = {
	setBreadcrumb: function(arr){
		$('#site-content .wrap ul').empty().append('<li><a href="#/welcome">Welcome</a></li>');
		for(var i = 0 ; i < arr.length ; i++){
			$('#site-content .wrap ul').append('<li>'+arr[i]+'</li>');
		}
		window.document.title = arr[arr.length-1];
	},
	openSubView: function(subView){
		if ((window.location.href.match(new RegExp("#", "g")) || []).length < 2)
        {
            location.href = window.location.href + '#' + subView;
        }
        else
        {
            location.href = '#' + location.hash.split(".")[0].split("#")[1];

            setTimeout(function()
            {
                location.href = '#' + location.hash.split(".")[0].split("#")[1] + '#' + subView;
            }, 300);
        }
	},
	refreshRemovedTooltip: function(){
		$('.qtip').each(function(){
			if($('[aria-describedby="'+$(this).attr('id')+'"]').length < 1){
				$(this).remove();
		    }
		});
	}
};


