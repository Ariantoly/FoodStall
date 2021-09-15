var sv;
var subView = {
	title : 'Accordion - Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded : function(){
		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-accordion').addClass('current');

         $('.accordion').binus_accordion();
		 $('.editor').binus_editor();

         training.setBreadcrumb(['Training', 'Accordion']);
	}
};