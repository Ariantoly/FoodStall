var sv;
var subView = {
	title : 'Form - Binusmaya',
	require : 'training',
	rel : 'trainingWrapper',
	onLoaded : function(){
		
		window.document.title = this.title;
		sv = this;

		$('.body-navigation ul li').removeClass('current');
        $('#nav-form').addClass('current');

        $('#ddlCourse').parent().binus_multiselect();
		// $('.datepicker').parent().binus_datepicker();
		
		$('.custom-datepicker').binus_datepicker();

        $('.timepicker').parent().binus_timepicker();
		$('.datetimepicker').parent().binus_datetimepicker();
		
		$('.custom-combobox').binus_combobox();

		$('.custom-chosen').binus_advanced_combobox();

        training.setBreadcrumb(['Training', 'Form']);

        sv.loadCountry();
        sv.loadAdvancedCountry();
	},
	loadCountry: function(){
		$('#ddlCountry').empty();
		for(var i = 0; i < 4; i++){
			$('#ddlCountry').append('<option value="'+i+'">"Country '+(i+1)+'"</option>');
		}
		$('#ddlCountry').closest('span').binus_combobox();
	},
	loadAdvancedCountry: function(){
		$('#ddlCtr').empty();
		for(var i = 0; i < 5; i++){
			$('#ddlCtr').append('<option value="'+i+'">"Ctr '+(i+1)+'"</option>');
		}
		$('#ddlCtr').closest('span').binus_advanced_combobox();
	},
};