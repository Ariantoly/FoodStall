var sv;
var subView = {
	title : 'Tabulation - Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded: function(){

		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-tabulation').addClass('current');

        $('.tabulation').binus_tabulation({
        	on_item_click: function(){

        	}
        });

       	$("#tab-satu").trigger("click");

       	training.setBreadcrumb(['Training', 'Tabulation']);
	},
};