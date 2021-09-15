var sv;
var subView = {
	title : 'Back To Welcome - Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded : function(){
		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-back').addClass('current');

         training.setBreadcrumb(['Training', 'Back']);
	}
};