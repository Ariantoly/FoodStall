jQuery(document).ready(function($) {
	// Top Navigation
	$('#top-nav > ul > li > a').click(function(e){
		e.preventDefault();
		var menu_item = $(this).parents('li');

		// Reset all #main-nav-expand condition	
		$('.sub-menu-pseudo').css({ 'display' : '' }).removeClass('expanded');
		$('#main-nav-expand li.expanded').removeClass('expanded');

		if( menu_item.is(':not(".hover")')){
			$('#top-nav > ul > li').removeClass('hover');
			menu_item.addClass('hover');

			$(window).trigger('scroll');
		} else {
			menu_item.removeClass('hover');
		}
	});

	// All menu item which has sub-menu should have .has-sub class. Make it automattic
	$('#main-nav-expand li:has("ul")').addClass('has-sub');

	// Show sub-menu
	$('#top-nav').on( 'click', '.has-sub > a', function(e){
		e.preventDefault();

		var menu_trigger = $(this);
		var menu_trigger_text = menu_trigger.text();
		var menu_trigger_li = menu_trigger.parent('li');
		var menu_content = menu_trigger_li.children('ul').html();
		var menu = menu_trigger.parents('.sub-menu');
		var menu_depth = menu.index();
		var submenu_summoned = $('.sub-menu:nth('+menu_depth+')');
		var submenu_summoned_left = parseInt(submenu_summoned.css('left'));
		var submenu_summoned_left_init = submenu_summoned_left - 146;

		if( submenu_summoned_left_init < 0 ){
			var submenu_summoned_left = 109;			
			var submenu_summoned_left_init = 0;
		}

		// If the expanded depth-1 is clicked again, close the .sub-menu-pseudo instead of re-showing it.
		if( menu_trigger_li.is('.expanded') && menu_depth == 1 ){
			$('.sub-menu-pseudo').animate({ 'left' : 0 }, 200, function(){
				$(this).css({ 'left' : '', 'display' : ''}).removeClass('expanded').find('li.expanded').removeClass('expanded');
				menu_trigger_li.removeClass('expanded');
			});
			return false;
		}		

		// Change trigger state
		menu.find('li.expanded').removeClass('expanded');
		menu_trigger_li.addClass('expanded');

		if( menu.is('.expanded') ){
			return false;
		}

		if( menu_depth > 1 ){
			// .sub-sub-menu / .sub-menu-pseudo is clicked
			var submenu_wrapper = menu_trigger.parents('.sub-menu-pseudo');
			var submenu_wrapper_left = parseInt( submenu_wrapper.css('left') );
			var submenu_wrapper_target = submenu_wrapper_left - 146 ;

			submenu_wrapper.animate({ 'left' : submenu_wrapper_target }, 200, function(){
				submenu_wrapper.addClass('expanded').css('left', '');
			});
		} else {
			$('#top-nav .sub-menu:gt(0)').removeClass('expanded').css('display', '');
		}
		
		// Summon the submenu
		submenu_summoned.html(menu_content).prepend('<li class="title pseudo-title"><a href="#"><span class="label">'+menu_trigger_text+'<i class="icon icon-close"></i></span></a></li>').css('left', submenu_summoned_left_init ).show().animate({ 'left' : submenu_summoned_left}, 200, function(){
			$(this).css( 'left', '' );
		});		
	});
	
	// Closing sub-menu from .pseudo-title
	$('#top-nav').on('click', '.pseudo-title > a', function(e){
		e.preventDefault();

		var menu_trigger = $(this);
		var menu_trigger_text = menu_trigger.text();
		var menu_trigger_li = menu_trigger.parents('li');
		var menu = menu_trigger.parents('.sub-menu');
		var menu_index = menu.index();

		var submenu_summoned_index = menu_index - 2;
		var submenu_summoned = $('.sub-menu:nth('+submenu_summoned_index+')');
		var submenu_summoned_left = parseInt( submenu_summoned.css('left') );
		var submenu_summoned_left_target = submenu_summoned_left + 225;

		// Check whether this sub-menu is active or .expanded
		if( menu.is('.expanded') ){
			jump_to_sub_menu_pseudo( menu_index );
		} else {
			// Show previous sub-menu
			if( menu_index > 2 ){
				submenu_summoned.animate({ 'left' : submenu_summoned_left_target }, 400, function(){
					submenu_summoned.css('left', '').removeClass('expanded');
				});
			}
			
			// Remove li "expanded" marker
			submenu_summoned.find('li.expanded').removeClass('expanded');

			// Hide current sub-menu
			menu.animate({ 'left' : 0 }, 200, function(){
				menu.empty().hide().css('left', '');
			});		
		}
	});
	
	// Jump to particular .sub-menu-pseudo
	$('#top-nav').on('click', '.sub-menu-pseudo.expanded a', function(e){
		e.preventDefault();
		e.stopPropagation();

		var menu_trigger = $(this);
		var menu_index = menu_trigger.parents('.sub-menu').index();

		jump_to_sub_menu_pseudo( menu_index );
	});	

	$('#top-nav').on('click', '.sub-menu-pseudo.expanded', function(e){
		e.preventDefault();

		var menu_trigger = $(this);
		var menu_index = menu_trigger.index();

		jump_to_sub_menu_pseudo( menu_index );

	});

	function jump_to_sub_menu_pseudo( submenu_index ){
		var submenu_index_target = parseInt( submenu_index ) - 1;
		$('.sub-menu:gt('+ submenu_index_target +')').animate({ 'left' : 0 }, 200, function(){
			$(this).css({ 'left' : '', 'display' : '' });
			$('.sub-menu:nth('+ submenu_index_target +')').removeClass('expanded').find('li.expanded').removeClass('expanded');
			$('.sub-menu:gt('+ submenu_index_target +')').removeClass('expanded').find('li.expanded').removeClass('expanded');
		});
	}

	// Widgets Control
	$('#widgets-control a').hover(
		function(){
			$(this).addClass('hover');
		},
		function(){
			$(this).removeClass('hover');
		}
	);

	// Equal Height Functionality
	function setEqualHeight(columns){
		var tallestcolumn = 0;
		columns.each(function(){
			currentHeight = $(this).outerHeight();
			if(currentHeight > tallestcolumn){
			tallestcolumn  = currentHeight;
			}
		});
		columns.height(tallestcolumn);
	}				
	setEqualHeight( $('#footer .item') );

	// Footer Popup Position
	var footer_height = $('#footer').outerHeight();
	$('#footer .content .popup').css({ 'bottom' : footer_height + 20 });

	// Custom Select
	if( $('.custom-select').length > 0 ){
		$('.custom-select').fancyfields();
	}

	// Custom Radiobutton
	if( $('.custom-radiobutton').length > 0 ){
		$('.custom-radiobutton').fancyfields();		
	}

	// User Role
	$('#current-user-role').click(function(){
		$('#user-role').toggleClass('expanded');

		if( $('#user-role').is('.expanded') ){
			$('#switch-role').animate({
				'margin-left' : -1
			});
		} else {
			$('#switch-role').animate({
				'margin-left' : -730
			});			
		}
	});

	// Upcoming Agenda
	$('#upcoming-agenda').on( 'click', '.icon.next', function(e){
		e.preventDefault();

		$('#agenda-list li:first a').animate({ 'opacity' : 0 }, 200, function(){
			$('#agenda-list li:first').appendTo('#agenda-list');
			$('#agenda-list li a').removeAttr('style');
		});
	});

	$('#upcoming-agenda').on( 'click', '.icon.previous', function(e){
		e.preventDefault();

		$('#agenda-list li:first a').animate({ 'opacity' : 0 }, 200, function(){
			$('#agenda-list li:last').prependTo('#agenda-list');
			$('#agenda-list li a').removeAttr('style');
		});
	});	

	// Body Nav
	var body_nav_width = 60;
	var body_nav_inside = $('#body-nav .inside').outerWidth();
	$('#body-nav ul li').each(function(){
		var body_nav_li_width = $(this).outerWidth();
		body_nav_width = body_nav_width + body_nav_li_width;
	});
	$('#body-nav .inside ul').width( body_nav_width );

	if( body_nav_inside > body_nav_width ){
		$('#body-nav .nav').hide();
	}

	$('#body-nav .prev').click(function(e){
		e.preventDefault();
		var distance = 0 - $('#body-nav ul li:last').outerWidth();
		$('#body-nav ul li:last').prependTo('#body-nav ul').css('margin-left', distance).animate({ 'margin-left' : 0 }, 200, function(){
			$('#body-nav ul li:first').css('margin-left', '');
		});
	});

	$('#body-nav .next').click(function(e){
		e.preventDefault();
		var distance = 0 - $('#body-nav ul li:first').outerWidth();
		$('#body-nav ul li:first').animate({ 'margin-left' : distance }, 200, function(){
			$(this).appendTo('#body-nav ul').css('margin-left', '' );
		});
	});

	// Main Nav Height
	function main_nav_height(){
		var offset = $(window).scrollTop();
		var sub_menu_height = $('#body-components').outerHeight();
		var top_nav_height = $('#top-nav').outerHeight();

		$('#main-nav-expand .sub-menu').height( sub_menu_height + (top_nav_height * 2) + 3 - offset );
	}
	// $('#top-nav').on('mouseenter', '#main-nav-expand', main_nav_height);

	// Search
	$('#search-expand a').click(function(e){
		e.preventDefault();
		if( $(this).parents('#search-expand').is('.focused') ){
			$('#search-expand').removeClass('focused');
			$('#search-form').hide().find('input[type="text"]').focusout();
		} else {
			$('#search-expand').addClass('focused');
			$('#search-form').fadeIn().find('input[type="text"]').stop().animate({ 'width' : 375 }, 200).focus();
		}
	});

	$('#search-form input[type="text"]').focusout(function() {
		$('#search-form input[type="text"]').animate({ 'width' : 0 }, 200, function(){
			$(this).parents('#search-form').hide().parents('#search-expand').removeClass('focused hover');
		});
	});

	// Fixed Top Nav Upon Scrolling
	var top_nav_totop = $('#top-nav').offset();
	var top_nav_height = $('#top-nav').outerHeight();
	var footer_totop = $('#footer').offset();

	$(window).scroll(function(){
		var offset = $(window).scrollTop();
		var document_height = $(document).height();
		var window_height = $(window).height();
                footer_totop = $('#footer').offset();

		if( ( offset > top_nav_totop.top ) && ( offset > ( document_height - window_height -  ( document_height - footer_totop.top ) ) ) ){
			// When the window reach the bottom
			$('body').addClass('scrolled');
			$('#main-nav-expand .sub-menu').height( window_height - top_nav_height - 1 - ( ( offset + window_height ) - footer_totop.top ) );
		} else if( offset < top_nav_totop.top ){
			// When the window is on top
			$('body').removeClass('scrolled');
			$('#main-nav-expand .sub-menu').height( window_height - top_nav_totop.top - top_nav_height + offset );
		} else {
			// During the scroll event in the middle of the page
			$('body').addClass('scrolled');
			$('#main-nav-expand .sub-menu').height( window_height - top_nav_height + 2 );
		}
	});
	// Footer Popup
	$('#footer .content .popup-trigger').click(function(e){
		e.preventDefault();
		
		var popup_trigger = $(this);
		var popup = popup_trigger.parents('.content').find('.popup');
		var popup_bottom = parseInt( popup.css('bottom').replace('px', '') );

		if( popup.is(':visible')){
			// visible
			popup.animate({ 'bottom' : popup_bottom + 15}, 200 ).fadeOut( 200, function() {
				popup.css( 'bottom', popup_bottom );
			});
			popup_trigger.removeClass('cancel');
		} else {
			// hidden
			popup.css('bottom', popup_bottom + 15 ).fadeIn(200).animate({'bottom' : popup_bottom}, 200);
			popup_trigger.addClass('cancel');
		}
	});

	$('#footer .content .popup-close').click(function(e){
		e.preventDefault();

		var popup_close = $(this);
		var popup = popup_close.parents('.popup');
		var popup_trigger = popup_close.parents('.content').find('.popup-trigger');
		var popup_bottom = parseInt( popup.css('bottom').replace('px', '') );
		
		popup.animate({ 'bottom' : popup_bottom + 15}, 200 ).fadeOut( 200, function() {
			popup.css( 'bottom', popup_bottom );
		});
		popup_trigger.removeClass('cancel');
	});

	// Modal
    function create_modal( source_type, source ){
        var window_width = $(window).width();
        var window_height = $(window).height();

        $('body').css({ 'overflow' : 'hidden' }).prepend('<div id="modal"><div id="modal-content"><img src="images/loading.gif" title="Loading..." class="loading" /></div><a href="#" id="modal-close" class="icon icon-close">Close</a></div><div id="modal-background"></div>');         

        if( source_type == 'url' ){
        	$('#modal-content').load( source, function(){
		        var modal_width_adj = 0 - $('#modal').outerWidth() / 2;
		        var modal_height_adj = 0 - $('#modal').outerHeight() / 2;

		        $('#modal').css({
		        	'margin-top' : modal_height_adj,
		        	'margin-left' : modal_width_adj
		        }).animate({
		        	'top' : '50%'		        	
		        }, 200);
        	});
        } else {
        	$('#modal-content').html( $(source).clone() );

	        var modal_width_adj = 0 - $('#modal').outerWidth() / 2;
	        var modal_height_adj = 0 - $('#modal').outerHeight() / 2;

	        $('#modal').css({
	        	'margin-top' : modal_height_adj,
	        	'margin-left' : modal_width_adj
	        }).animate({
	        	'top' : '50%'		        	
	        }, 200);
        }
    }

    // CLOSE MODAL
    function close_modal(){
            var window_height = $(window).height();
            
            $('#modal').animate({
                    'top' : (0 - (window_height * 2))
            }, 400, function(){
                    $('#modal').remove();
                    $('#modal-background').fadeOut(function(){
                            $(this).remove();
                            $('body').css('overflow', 'auto');
                            $('.binus-gallery-item').removeClass('active');
                    });
            });
            
    }
    
    $('body').on('click', '#modal-background, #modal-close', function(){
            close_modal();          
            return false;
    });
    
    $(document).keyup(function(e){
            if ( e.keyCode == 27 && $('body #modal').length > 0){
                    close_modal();
            }
    });

    // Popup Demo
    $('#show-popup, #change-avatar').click(function(e){
    	e.preventDefault();
    	create_modal( 'url', 'popup-content.html' );	
    });

    $('#show-popup-internal').click(function(e){
    	e.preventDefault();
    	create_modal( 'id', '#internal-popup' );	
    });

    // GPA Wheel & Performance Meter
	$('.gpa-wheel').each(function(){
		var id = $(this).attr('id');
		gpa_wheel( id );
	});

	function gpa_wheel( selector_id ){
		var paper = Raphael(selector_id, 152, 150);

		paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
		   var alpha = 360 / total * value,
		       a = (90 - alpha) * Math.PI / 180,
		       x = xloc + R * Math.cos(a),
		       y = yloc - R * Math.sin(a),
		       path;
		   if (total == value) {
		       path = [
		           ["M", xloc, yloc - R],
		           ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
		       ];
		   } else {
		       path = [
		           ["M", xloc, yloc - R],
		           ["A", R, R, 0, +(alpha > 180), 1, x, y]
		       ];
		   }
		   return {
		       path: path
		   };
		};	

		// Get the data
		var data_value = parseFloat( $('#'+selector_id).attr('data-value') );
		var data_scale = parseFloat( $('#'+selector_id).attr('data-scale') );		

		// Just in case
		if( data_value > data_scale ){
			data_value = data_scale;
		}

		// Calculate the circle's variable
		var target_value = ( data_value / data_scale) * 330;
		var target_value_percentile = ( data_value / data_scale) * 100;
		var target_scale = 360;

		// Color Scheme
		if( ( target_value_percentile > 0 ) && ( target_value_percentile < 10 ) ){ var end_color = '#d12f2e';
		} else if( ( target_value_percentile >= 10 ) && ( target_value_percentile < 20 ) ) { var end_color = '#dd5c33';
		} else if( ( target_value_percentile >= 20 ) && ( target_value_percentile < 30 ) ) { var end_color = '#e88a39';
		} else if( ( target_value_percentile >= 30 ) && ( target_value_percentile < 40 ) ) { var end_color = '#f4b73e';
		} else if( ( target_value_percentile >= 40 ) && ( target_value_percentile < 50 ) ) { var end_color = '#ffe443';
		} else if( ( target_value_percentile >= 50 ) && ( target_value_percentile < 60 ) ) { var end_color = '#c5cf45';
		} else if( ( target_value_percentile >= 60 ) && ( target_value_percentile < 70 ) ) { var end_color = '#8bbb47';
		} else if( ( target_value_percentile >= 70 ) && ( target_value_percentile < 80 ) ) { var end_color = '#50a648';
		} else if( ( target_value_percentile >= 80 ) && ( target_value_percentile < 90 ) ) { var end_color = '#45a249';
		} else if( ( target_value_percentile >= 90 ) ) { var end_color = '#16914a';
		}

		// Draw the circle at value == 0, then animate it to the target_value
		var my_arc = paper.path().attr({
		   "stroke": "#d2302e",
		   "stroke-width": 12,
		   "stroke-linecap" : 'round',
		   arc: [100, 100, 0, target_scale, 70]
		}).transform("t-42,114r195");

		my_arc.animate({
			"stroke" : end_color,
			arc: [100, 100, target_value, target_scale, 70]
		}, 2000);

		// Number animation
		var number_init = 0;
		var number_target = data_value;
		var number_animated = setInterval( number_animation, 1 );
		
		function number_animation(){
			number_increase = number_target / 300;
			number_init = number_init + number_increase;
			$('#'+selector_id+' .label').text( number_init.toFixed(2) );

			if( number_init === number_target || number_init > number_target){
				clearInterval( number_animated );
			$('#'+selector_id+' .label').text( number_target.toFixed(2) );
			}
		}
	}

	$('.performance-meter').each(function(){
		var id = $(this).attr('id');
		performance_meter( id );
	});

	function performance_meter( selector_id ){
		var paper = Raphael(selector_id, 183, 99);

		paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
		   var alpha = 360 / total * value,
		       a = (90 - alpha) * Math.PI / 180,
		       x = xloc + R * Math.cos(a),
		       y = yloc - R * Math.sin(a),
		       path;
		   if (total == value) {
		       path = [
		           ["M", xloc, yloc - R],
		           ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
		       ];
		   } else {
		       path = [
		           ["M", xloc, yloc - R],
		           ["A", R, R, 0, +(alpha > 180), 1, x, y]
		       ];
		   }
		   return {
		       path: path
		   };
		};	

		// Get the data
		var data_value = parseFloat( $('#'+selector_id).attr('data-value') );
		var data_scale = parseFloat( $('#'+selector_id).attr('data-scale') );

		// Just in case
		if( data_value > data_scale ){
			data_value = data_scale;
		}

		// Calculate the circle's variable
		var target_value = ( data_value / data_scale) * 180;
		var target_value_percentile = ( data_value / data_scale) * 100;
		var target_scale = 360;

		// Color Scheme
		if( ( target_value_percentile > 0 ) && ( target_value_percentile < 10 ) ){ var end_color = '#d12f2e';
		} else if( ( target_value_percentile >= 10 ) && ( target_value_percentile < 20 ) ) { var end_color = '#dd5c33';
		} else if( ( target_value_percentile >= 20 ) && ( target_value_percentile < 30 ) ) { var end_color = '#e88a39';
		} else if( ( target_value_percentile >= 30 ) && ( target_value_percentile < 40 ) ) { var end_color = '#f4b73e';
		} else if( ( target_value_percentile >= 40 ) && ( target_value_percentile < 50 ) ) { var end_color = '#ffe443';
		} else if( ( target_value_percentile >= 50 ) && ( target_value_percentile < 60 ) ) { var end_color = '#c5cf45';
		} else if( ( target_value_percentile >= 60 ) && ( target_value_percentile < 70 ) ) { var end_color = '#8bbb47';
		} else if( ( target_value_percentile >= 70 ) && ( target_value_percentile < 80 ) ) { var end_color = '#50a648';
		} else if( ( target_value_percentile >= 80 ) && ( target_value_percentile < 90 ) ) { var end_color = '#45a249';
		} else if( ( target_value_percentile >= 90 ) ) { var end_color = '#16914a';
		}

		// Draw the circle at value == 0, then animate it to the target_value
		var my_arc = paper.path().attr({
		   "stroke": "#d2302e",
		   "stroke-width": 12,
		   "stroke-linecap" : 'round',
		   arc: [100, 100, 0, 360, 84]
		}).transform("t-93,75r270");

		my_arc.animate({
			"stroke" : end_color,
			arc: [100, 100, target_value, target_scale, 84]
		}, 2000);
	}
});