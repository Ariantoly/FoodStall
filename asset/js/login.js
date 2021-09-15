jQuery(document).ready(function($) {
	// Same Height Mechanism
	function setEqualHeight(columns){
		var tallestcolumn = 0;
		columns.each(function(){
			currentHeight = $(this).height();
			if(currentHeight > tallestcolumn){
			tallestcolumn  = currentHeight + 8;
			}
		});
		columns.height(tallestcolumn);
	}

	// Top Nav Decoration
	$('#backtobinus').next().css({ 'border-left' : 'none', 'margin-left' : '-20px' }).children('a').css({ 'padding-left' : '30px' });
	$('#top-nav .menu > li > .sub-menu').each(function(){
		setEqualHeight($(this).children('li').children('a'));
	});

	// Sub-menu indicator
	$('#top-nav li').has('.sub-menu').children('a').append(' <span class="sub-menu-indicator">&raquo;</span>');

	// Top Nav Behavior
	$('#top-nav .sub-menu').hide();

	$('#top-nav li').hover(
		function(){
			$(this).addClass('active').children('.sub-menu').fadeIn();
		},
		function(){
			$(this).removeClass('active').children('.sub-menu').fadeOut();
		}
	);

	var element_selected, default_selected;
	// Select Behavior
	function select_styleable(selector){
		// get select name
		var select_name = selector.attr('name');
		selector.after('<div id="styleable-'+ select_name +'-wrap" class="styleable-wrap" style="position:relative; display:inline-block; "><span id="styleable-'+ select_name +'-title" class="styleable-title"><input type="text" class="select-search styleable-title-label" value="" /><span class="styleable-title-icon"></span></span> <ul id="styleable-'+ select_name +'" class="styleable-options" style="display:block; width: 100%;"></ul></div>');
		selector.attr('name', select_name + '-placeholder').hide();
		selector.after($('<input type="hidden" />').attr('name', select_name));

		// Option's value is being set as lowercase for filtering purpose
		selector.children('option').each(function(){
			var selector_option_value = $(this).attr('value').toLowerCase();
			$(this).attr('value', selector_option_value);
		});

		// Set selected
		$('#styleable-' + select_name + '-title .styleable-title-label').val($('select[name="'+ select_name +'-placeholder"] option').filter(':selected').text());

		// Get select's options
		selector.find('option').each(function(){
			var option_value = $(this).attr('value').toLowerCase();
			var option_label = $(this).text();

			// Inject the options
			if ($(this).is(':selected')){
				$('#styleable-' + select_name).append('<li><a href="#" data-value="'+ option_value +'" style="font-weight:bold;">'+ option_label +' <span class="checkmark">&#10004;</span></a></li>');
			} else {
				$('#styleable-' + select_name).append('<li><a href="#" data-value="'+ option_value +'">'+ option_label +'</a></li>');
			}
		});

		// Adding not found state
		$('#styleable-' + select_name).append('<li class="select-filter-not-found">No Result For: <span style="font-style:italic;"></span></li>').children('.select-filter-not-found').css({
			'display' : 'block',
			'background' : '#b8b8b8',
			'color' : 'white',
			'border-top' : '1px solid #cccccc',
			'padding' : '5px 10px',
			'text-align' : 'center'
		}).hide();


		// give it proper styling
		$('#styleable-' + select_name + '-wrap').css({
			'position' : 'relative',
			'z-index' : '2000'
		});

		$('#styleable-' + select_name + '-title').css({
			'display' : 'block',
			'cursor' : 'pointer'
		});

		$('#styleable-' + select_name).css({
			'position' : 'absolute',
			'top' : $('#styleable-' + select_name + '-title').height() + 2,
			'left' : 0
		}).find('a').css({
			'display' : 'block',
			'background' : '#b8b8b8',
			'color' : 'white',
			'border-top' : '1px solid #cccccc'
		});

		// hide the options
		$('#styleable-' + select_name).hide();

		// On Clicking the custom select title
		//$('body').on('click', '#styleable-' + select_name + '-title', function(){



		$('#styleable-' + select_name + '-title').click(function(){
			// revert previous edited selection to the original one
			if(element_selected) {
				$('#styleable-' + element_selected + '-title .styleable-title-label').val(default_selected);
			}

			// Deactivate other select. Making sure that there is only one active custom select at time
			element_selected = select_name;
			default_selected = $(this).find('.styleable-title-label').val();

			$('.styleable-wrap:not(#styleable-' + select_name + '-wrap)').each(function(){
				// Hide all no match found & resurrect the origin options
				$(this).find('.styleable-options .select-filter-not-found').hide();
				$(this).find('.styleable-options li a').show();
			});

			$('.styleable-wrap:not(#styleable-' + select_name + '-wrap)').removeClass('active');
			$('.styleable-options:not(#styleable-' + select_name+ ')').slideUp(100);

			// Activate the correct dropdown
			$('#styleable-' + select_name).slideToggle('fast');
			$('#styleable-' + select_name + '-wrap').toggleClass('active');
			return false;
		});

		// On Filtering functionality
		$('#styleable-' + select_name + '-title .select-search').change(function(){

			// Filter Query
			var filter_query = $(this).val().toLowerCase();

			// Search for similar DOM
			if (filter_query != ''){
				//$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a[data-value*="'+ filter_query +'"]').slideDown();
				$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a').filter(function() { return $(this).text().toLowerCase().indexOf(filter_query) != -1 ? this : null; } ).show();
				//$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a').not('[data-value*="'+ filter_query +'"]').hide();
				$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a').not(function() { return $(this).text().toLowerCase().indexOf(filter_query) != -1 ? this : null; } ).hide();

				var result_height = $(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a:visible').size();
				if (result_height < 1){
					$('#styleable-' + select_name).children('.select-filter-not-found').fadeIn().children('span').text(filter_query);
				} else {
					$('#styleable-' + select_name).children('.select-filter-not-found').hide();
				}
			} else {
				$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a').slideDown();
			}

		}).keyup(function(e){
			$(this).change();
		}).keydown(function(e){
			if ( e.keyCode == 13 ){
				e.preventDefault();
			}
		});

		// On hovering the options
		$('#styleable-' + select_name + ' a').hover(
			function(){
				$(this).css({ 'background' : '#f5b000' });
			},
			function(){
				$(this).css({ 'background' : '#b8b8b8' });
			}
		);

		// On selecting the options
		$('body').on('click', '#styleable-' + select_name + ' a', function(){
			element_selected = defeault_selected = '';

			var value_selected = $(this).attr('data-value').toLowerCase();
			var label_selected = $(this).clone().children().remove().end().text();

			// Change the presentational state
			$('#styleable-' + select_name + ' a').css({ 'font-weight' : 'normal' });
			$('#styleable-' + select_name + ' a .checkmark').remove();

			$(this).css({ 'font-weight' : 'bold' });
			$(this).append(' <span class="checkmark">&#10004;</span>');

			$('#styleable-' + select_name + '-title .styleable-title-label').val(label_selected);

			// Set the actual value
			//selector.children('option').attr('selected', false);
			//selector.children('option[value="'+ value_selected +'"]').attr('selected', true);
			$('[name='+select_name+']').val(value_selected);

			// Hide the dropdown
			$('#styleable-' + select_name).slideUp();
			$('#styleable-' + select_name + '-wrap').removeClass('active');

			// All options should be showed
			$(this).parents('#styleable-' + select_name + '-wrap').find('.styleable-options a').slideDown();

			return false;
		});

		// Select search behavior
		$('body').on('focus', '#styleable-' + select_name + '-title .select-search', function(){
			var search_selected_option = $('select[name="'+ select_name +'"] option').filter(':selected').text().toLowerCase();
			var search_default_text = $('#styleable-' + select_name + '-title .select-search').attr('value').toLowerCase();

			if ( search_default_text == search_selected_option ){
				$(this).attr('value', '');
			}
		});

		$('body').on('blur', '#styleable-' + select_name + '-title .select-search', function(){
			var search_selected_option = $('select[name="'+ select_name +'"] option').filter(':selected').text().toLowerCase();
			var search_default_text = $('#styleable-' + select_name + '-title .select-search').attr('value').toLowerCase();

			if ( search_default_text == '' ){
				$(this).attr('value', search_selected_option);
			}
		});


	}

	// Password Behavior
	function password_behavior(selector){
		var password_value = selector.val();
		var password_id = selector.attr('id');
		var password_height = selector.height() + 2;

		selector.css({ 'position' : 'relative', 'z-index' : '1100', 'opacity' : '0' });
		selector.after('<input class="text" id="'+ password_id +'-mirror" type="text" value="'+ password_value +'" style="margin-top:-'+ password_height +'px; position:relative; z-index:1000;" />');
		selector.on({
			'focus': function(){ $(this).css('opacity', 1); },
			'blur': function(){ if ( $(this).attr('value') == '' ){ $(this).css({'opacity' : 0}) } }
		});
	}
	password_behavior($('#userpassword'));

	// Behaving Input Text
	function text_input_behavior(){
		$('form .text').each(function(){

			// Default Variable
			var defaultValue = $(this).attr('value');

			// on focus
			$(this).focus(function(){
				if ( $(this).attr('value') == defaultValue ){
					$(this).attr('value', '').addClass('filled');
				}
			});

			// on blur
			$(this).blur(function(){
				if ( $(this).attr('value') == '' ){
					$(this).attr('value', defaultValue).removeClass('filled');
				}
			});

		});
	}
	text_input_behavior();

	// Align vertical center
	function centerize_wrap(){
		var window_height = $(window).height();
		var wrap_height = $('#wrap').height();

		if (window_height > wrap_height){
			var wrap_distance_to_top = (window_height - wrap_height) / 2;
			$('#wrap').css('margin-top', wrap_distance_to_top);
		} else {
			$('#wrap').css('margin-top', '0');
		}
	}
	centerize_wrap();

	$(window).resize(function(){
		centerize_wrap();
	});

	// Closing Modal Box
	function overlay_close(after){
		if(after && typeof after == 'function') {
			after();
		}
		$('#overlay-wrap').fadeOut('fast', function(){
			$(this).remove();
			$('body').off('click', '**');
		});
	}

	function overlay_close_events(after){
	// Using click on close button
		$('body').on('click', '#overlay-close', function(){
			overlay_close(after);

			return;
		});

		// Using click on the overlay
		$('body').on('click', '#overlay-wrap', function(e){
			if (this == e.target){
				overlay_close(after);
			}
			return;
		});

		// Using keyboard
		$(document).keyup(function(e){
			if ( e.keyCode == 27 ){
				overlay_close(after);
			}
		});
	}
	overlay_close_events();


	/** Logic part **/
	function register() {
		var source = 'register.html';
		var topnav_position = $('#top-nav').offset();

		$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content"><img src="images/loading.gif" id="overlay-loading" /></div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
		$('#overlay-wrap').fadeIn();
		$('#overlay-content').load(source, function(){

			$.get(BM.serviceUri + 'utility/time', function(data) {
				var y = data.substr(0, 4);
				$('#date-of-birth-year').empty().append('<option value="">Year</option>');
				for(var i= y - 10; i > y - 100; i--) {
					$('#date-of-birth-year').append($('<option></option>').attr('value', i).text(i));
				}

				select_styleable($('#date-of-birth-day'));
				select_styleable($('#date-of-birth-month'));
				select_styleable($('#date-of-birth-year'));
				overlay_close_events(function(){ window.location.hash = ''; });
				text_input_behavior();

			});

			// password confirmation behavior
			$('[name=confirm]').keyup(function(e){
				var v = $('[name=confirm]').val();
				var p = $('[name=password]').val();
				if(p != v) {
					$('[name=confirm]').css('background', '#fcc');
				} else {
					$('[name=confirm]').css('background', 'none');
				}
			});

			$('#register-form').submit(function(e){
				e.preventDefault();

				var v = $('[name=confirm]').val();
				var p = $('[name=password]').val();
				if(v != p) {
					alert('Password and confirmation are not matched');
					return;
				}

				var registerData = {
					UserName: $('[name=email]').val(),
					Password: $('[name=password]').val(),
					UserID: $('[name=userid]').val(),
					DobDay: $('[name=dobd]').val(),
					DobMonth: $('[name=dobm]').val(),
					DobYear: $('[name=doby]').val()
				};
				$.ajax({
					url: BM.serviceUri + 'usersession/register',
					data: JSON.stringify(registerData),
					success: function(data, status) {
						if(data.status == 'success') {
							alert('User creation success. You can login using the login form.');
							location.href = 'login.html';
						} else {
							var err = '';
							for(var i in data.error)
								err += data.error[i] + '\n';

							alert(err);
						}
					},
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					type: 'POST'
				});
			});
		});

		return false;
	}

	function forgotPassword() {
		var source = 'forgot.html';
		var topnav_position = $('#top-nav').offset();

		$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content"><img src="images/loading.gif" id="overlay-loading" /></div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
		$('#overlay-wrap').fadeIn();
		$('#overlay-content').load(source, function(){
			$.get(BM.serviceUri + 'utility/time', function(data) {
				var y = data.substr(0, 4);
				$('#date-of-birth-year').empty();
				for(var i= y - 10; i > y - 100; i--) {
					$('#date-of-birth-year').append($('<option></option>').attr('value', i).text(i));
				}

				select_styleable($('#date-of-birth-day'));
				select_styleable($('#date-of-birth-month'));
				select_styleable($('#date-of-birth-year'));
				overlay_close_events(function(){ window.location.hash = ''; });
				text_input_behavior();

			});

			// password confirmation behavior
			$('[name=confirm]').keyup(function(e){
				var v = $('[name=confirm]').val();
				var p = $('[name=password]').val();
				if(p != v) {
					$('[name=confirm]').css('background', '#fcc');
				} else {
					$('[name=confirm]').css('background', 'none');
				}
			});

			$('#register-form').submit(function(e){
				e.preventDefault();

				var v = $('[name=confirm]').val();
				var p = $('[name=password]').val();
				if(v != p) {
					alert('Password and confirmation are not matched');
					return;
				}

				var registerData = {
					UserName: $('[name=email]').val(),
					Password: $('[name=password]').val(),
					UserID: $('[name=userid]').val(),
					DobDay: $('[name=dobd]').val(),
					DobMonth: $('[name=dobm]').val(),
					DobYear: $('[name=doby]').val()
				};
				$.ajax({
					url: BM.serviceUri + 'usersession/resetpassword',
					data: JSON.stringify(registerData),
					success: function(data, status) {
						if(data.status == 'success') {
							alert('Password reset successfully. You can now login with your new password using the login form.');
							location.href = 'login.html';
						} else {
							var err = '';
							for(var i in data.error)
								err += data.error[i] + '\n';

							alert(err);
						}
					},
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					type: 'POST'
				});
			});
		});

		return false;
	}

	function justLoadFile(source) {
		var topnav_position = $('#top-nav').offset();

		$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content"><img src="images/loading.gif" id="overlay-loading" /></div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
		$('#overlay-wrap').fadeIn();
		$('#overlay-content').load(source);

		overlay_close_events(function(){ window.location.hash = ''; });
		return false;
	}

	if(location.hash=='#register') register();
	else if(location.hash=='#forgot-password') forgotPassword();
	else if(location.hash=='#howtouse') justLoadFile('howtouse.html');
	else if(location.hash=='#changelog') justLoadFile('changelog.html');

	$(window).bind('hashchange', function(e){
		if(location.hash == '#register') register();
		else if(location.hash == '#forgot-password') forgotPassword();
		else if(location.hash == '#howtouse') justLoadFile('howtouse.html');
		else if(location.hash == '#changelog') justLoadFile('changelog.html');
	});


	var google = googleLogout = false;
	if(location.hash == '#google') {
		google = true;
		$('#logintitle').text('GOOGLE APPS LOGIN');
		$('#appnote').text('After you submit your information here, you will be logged into both Google Apps and Binusmaya 3.0. This page will be redirected to Google Apps after you log in.');
	}
	if(location.hash == '#google-logout') {
		googleLogout = true;
	}

	$.ajax({
		url: BM.serviceUri + 'usersession/checksession',
		success: function(data) {
			if(data.status == 'loggedin') {
				$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content" style="text-align:center">You are already logged in</div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
				$('#overlay-wrap').fadeIn();
				$('#overlay-content').load('loggedin.html', function() {
					if(googleLogout) {
						$('#logtitle').text('You have been logged out from Google Apps').after('<p>You have been successfully logged out from Google Apps, however you still have an active session in Binusmaya 3</p>');
					}
					$('#continuesession').attr('href', data.link);
					$('#loggedname').text(data.name);
					$('#relogsession').click(function(e){
						$('#overlay-wrap').fadeOut(function() {
							$(this).remove();
						})
					});
				});
			} else {
				if(googleLogout) {
					$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content" style="text-align:center">You have been logged out from Google Apps</div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
					$('#overlay-wrap').fadeIn();
				}
			}
		}
	});
	$('#login').submit(function(e){
		e.preventDefault();
		$('body').prepend('<div id="overlay-wrap" style="display:none; position:fixed; overflow:scroll; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:3000; "><div class="wrap" id="overlay" style="margin-top:20px; position:relative;"><div id="overlay-content" style="text-align:center">Processing Login</div><a href="#" id="overlay-close" title="Close this window">Close</div></div></div>');
		$('#overlay-wrap').fadeIn();
		var email = $('[name=e]').val();

		if (!email.match(/@binus\.ac\.id$/gi)) {
			email += '@binus.ac.id';
		}

		var loginData = {
			UserName: email,
			Password: $('[name=p]').val(),
			Role: null,
			SpesificUserID: null
		};

		if(google)
			loginData.Google = true;

		$.ajax({
			url: BM.serviceUri + 'usersession/login',
			data: JSON.stringify(loginData),
			success: function(data, status) {
				if(data.status == 'success') {					
					location.href = data.redirect;					
				} else {
					$('#overlay-content').text('Login Failed');
					setTimeout(function() { $('#overlay-wrap').fadeOut(); }, 2500);
				}
			},
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			type: 'POST'
		});
	});
});
