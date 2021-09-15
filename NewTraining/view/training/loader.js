var sv;
var subView = {
	title : 'Loader - Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded : function(){

		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-loader').addClass('current');

        training.setBreadcrumb(['Training', 'Loader']);
	}
};