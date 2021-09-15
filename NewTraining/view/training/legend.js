var sv;
var subView = {
	title : 'Legend = Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded : function(){

		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-legend').addClass('current');

        training.setBreadcrumb(['Training', 'Legend']);
	}
};