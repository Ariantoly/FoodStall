var $_GET = {};
var viewsQueue = 0;
var viewHistoryStack = [];
var isHistoryBack = false;

window.onerror = function(message, url, lineNumber) {
	if (!message.match(/jCarousel/gi)) {
		BM.logClientError(message);
	}

	return false;
};

BM.insideErrorHandler = false;
BM.logClientError = function(message) {
	if (BM.insideErrorHandler) {
		return true;
	}
	
	BM.insideErrorHandler = true;
	
	$.ajax({
		type: 'POST',
		url: BM.serviceUri + 'lecturer/logger/logClientError',
		data: JSON.stringify({
			message: message,
			url: location.href
		}),
		contentType: "application/json; charset=utf-8",
		dataType: "json"
	})
	.always(function() {
		if (console && console.log) {
			console.log('Error log sent');
		}
	}); // black hole

	BM.insideErrorHandler = false;
};

BM.applyProfilePictureOnError = function() {
	var defaultProfpic = BM.imageUri + 'profilepic/default.png';
	$('img.profilepicture:not(.profilepicture-onerror-applied)').each(function() {
		var $this = $(this);
		
		$this.error(function() {
			$this.attr("src", defaultProfpic);
			//$this.unbind('error');
		})
		.addClass('profilepicture-onerror-applied')
		.attr("src", $this.attr("src"));
	});
};

BM.globalErrorNotifier = function(message) {
	var $this = $('#loading-info');
	$this
		.addClass('onerror')
		.find('span')
			.html('Sorry, it seems that something went wrong while loading this page.<br />Please try reloading the page. If the problem persists, please contact the administrator for further help.');
	
	if (message) {
		console.log(message);
	}

	setTimeout(function() {
		$this.fadeOut();
	}, 15000);
};

BM.onViewLoad = function() {
	var _scrollTop = 0;
	if (isHistoryBack && viewHistoryStack[2] && viewHistoryStack[2]['view'] == viewHistoryStack[0]['view']) {
		_scrollTop = viewHistoryStack[2]['scrollTop'];
		isHistoryBack = false;
	}

	$('body,html').animate({
		scrollTop: _scrollTop
	}, 'fast');
	
	// LECTURER CMS PAGE NAV
	var recLeft=recRight=true;
	var recCount=0;
	recCount = $('#lecturernav li').length;
	var selectedIndex = $('#lecturernav li.selected').index('#lecturernav li');
	$('#lecturernav ul').jcarousel({
		scroll: 5,
		initCallback: function(car){
			if(car.first == 1) {
				recLeft=false;
			} else {
				recLeft=true;
			}
			
			if(car.last == recCount) {
				recRight=false;
			} else {
				recRight=true;
			}
				
			$('#lecturernav .slideleft').bind('click', function() {
				car.prev();
				recLeft=true;
				if(car.first == 1) {
					$('#lecturernav .slideleft').css('display','none');
					recLeft=false;
				} else {
					$('#lecturernav .slideleft').css('display','block');
					recLeft=true;
				}
				
				if(car.last == recCount) {
					$('#lecturernav .slideright').css('display','none');
					recRight=false;
				} else {
					$('#lecturernav .slideright').css('display','block');
					recRight=true;
				}
				return false;
			});

			$('#lecturernav .slideright').bind('click', function() {
				car.next();
				if(car.first == 1) {
					$('#lecturernav .slideleft').css('display','none');
					recLeft=false;
				} else {
					$('#lecturernav .slideleft').css('display','block');
					recLeft=true;
				}
				
				if(car.last == recCount) {
					$('#lecturernav .slideright').css('display','none');
					recRight=false;
				} else {
					$('#lecturernav .slideright').css('display','block');
					recRight=true;
				}
				return false;
			});
			
			$('#lecturernav ul').css({overflow: 'visible'});
		},
		// This tells jCarousel NOT to autobuild prev/next buttons
		buttonNextHTML: null,
		buttonPrevHTML: null,
		start: (selectedIndex > 9 ? 13 : (selectedIndex > 4 ? 6 : 1))
	});
	$('#lecturernav,.slideright,.slideleft').bind('mouseover',function(e){
		if(recLeft) {
			$('#lecturernav .slideleft').css('display','block');
		}
		if(recRight) {
			$('#lecturernav .slideright').css('display','block');
		}
	});
	
	$('#lecturernav').bind('mouseout',function(e){
		$('#lecturernav .slideright, #lecturernav .slideleft').css('display','none');
	});
	
	$('a.fancybox:not(.disabled)').fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600,
		'speedOut'		:	200,
		'overlayShow'	:	false
	});
	
	$('a.sharebutton:not(.disabled)').fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	false,
		'content' 		:	$('#formshare')
	});
	
	$('.datepicker').attr({readonly: true}).datepicker({
		dateFormat: "dd-mm-yy",
		changeYear: true,
		beforeShow: function( input, inst ){
			// Force datepicker position top
			if( $(input).is('.on_top') ){
				window.setTimeout(function () {
					var height_datepicker = inst.dpDiv.outerHeight();
					var height_input = $(input).outerHeight();
					var datepicker_offset = inst.dpDiv.offset();
					var input_offset = $(input).offset();

					if( datepicker_offset.top > input_offset.top ){
						var margin_top = 0 - height_input - height_datepicker;
						inst.dpDiv.css({ 'margin-top' :  margin_top });
					}
				}, 1);				
			}
		}
	});
};

BM.buildPeriodMover = function(container, onmove, settings) {
	settings = $.extend({
		type: BM.buildPeriodMover.TYPE_FULL,
		degree: BM.buildPeriodMover.DEGREE_BACHELOR
	}, settings);

	var prevPeriod, nextPeriod;

	var elm = $('<div class="selectperiod">' +
		'<ul class="clearfloat" style="margin-left:0px;">' +
			'<li><a href="" class="prevPeriodLink icon icon-pointer-left">Prev</a></li>' +
			'<li class="currentperiod"></li>' +
			'<li><a href="" class="nextPeriodLink icon icon-pointer-right">Next</a></li>' +
		'</ul>' +
	'</div>');
	
	function disableButtons() {
		prevPeriod = null;
		nextPeriod = null;
		elm.find('.prevPeriodLink, .nextPeriodLink').css({opacity: 0.4});
	}
	function enableButtons() {
		if (prevPeriod) {
			elm.find('.prevPeriodLink').css({opacity: 1});
		}
		if (nextPeriod) {
			elm.find('.nextPeriodLink').css({opacity: 1});
		}
	}

	elm.find('.prevPeriodLink').click(function(e) {
		e.preventDefault();
		
		if (prevPeriod) {
			onmove(prevPeriod);
			disableButtons();
		}
	});
	elm.find('.nextPeriodLink').click(function(e) {
		e.preventDefault();
		
		if (nextPeriod) {
			onmove(nextPeriod);
			disableButtons();
		}
	});
	
	elm.appendTo(container);
	
	$(container).bind('periodLoad', function(e, currentPeriod) {
		
		//alert(currentPeriod);
		var textShown = currentPeriod;
		
		if (settings.type == BM.buildPeriodMover.TYPE_FULL) {
			textShown = BM.formatPeriod(textShown);

			$.loadservice('lecturer/periods/getPrevNextPeriods/' + settings.degree + '/' + currentPeriod, function(data) {
				prevPeriod = data.PrevPeriod;
				nextPeriod = data.NextPeriod;
				
				enableButtons();
			});
		}
		else if (settings.type == BM.buildPeriodMover.TYPE_YEAR) {
			prevPeriod = parseInt(currentPeriod) - 1;
			nextPeriod = parseInt(currentPeriod) + 1;
			
			enableButtons();
		}

		elm.find('.currentperiod').text(textShown);
	})
};

BM.buildPeriodMover.DEGREE_BACHELOR = 1;
BM.buildPeriodMover.DEGREE_MASTER = 2;
BM.buildPeriodMover.DEGREE_DOCTORAL = 3;

BM.buildPeriodMover.TYPE_FULL = 1;
BM.buildPeriodMover.TYPE_YEAR = 2;

$(document).ready(function() {
	var loadingTimer;
	
	$('#loading-info').ajaxStart(function() {
		var $this = $(this);
		$this.find('span').text('Loading...');
		$this.removeClass('onerror').fadeIn('fast');
		
		loadingTimer = setTimeout(function() {
			$.xhrPool.abortAll(); // aborts all outstanding ajax requests upon errors
			$.event.trigger("ajaxStop");

			BM.globalErrorNotifier();
		}, 300000); // 15 seconds timeout
	});
	
	$('#loading-info').ajaxStop(function() {
		if (!$(this).hasClass('onerror')) {
			$(this).fadeOut('fast');
			clearTimeout(loadingTimer);
			loadingTimer = null;
			setTimeout(BM.applyProfilePictureOnError, 200);
		}
	});
	
	var role;
	
	// $('#headnav, #loginprofilepicture').serviceBind('lecturer/init/initdata', false, function(data) {
		// $('#loginprofilepicture').html('<img src="' + BM.imageUri + 'profilepic/' + data.UserInfo.ID + '.png" class="profilepicture" />');

		// $('.user-profile-picture').each(function(){
			// $(this).html('<img src="' + BM.imageUri + 'profilepic/' + data.UserInfo.ID + '.png" class="avatar" />');
		// });
		
		// var UserInfo = {};
		// UserInfo.username = data.UserInfo.ID;
		// UserInfo.name  = data.UserInfo.Name;

		// /* Role Based App List Menu */

		// $('#roleLabel').text(($.cookie('roleLabel') || 'Lecturer').toUpperCase());
		// role = $.cookie('role') || 'lecturer';
		
		// $('#roleselector a').click(function() {
			// $.cookie('role', $(this).data('targetRole'));
			// $.cookie('roleLabel', $(this).text());
		// });			
						

		// $.ajax({
			// type: 'POST',
			// url: BM.serviceUri + 'lecturer/init/navigationhelper',
			// contentType: "application/json; charset=utf-8",
			// dataType: "json",
			// success: function(data){
				
				// $.getJSON('json/navigation-' + role + '.json', function(apps, textStatus) {
					
					// if (textStatus == "error") {
						// alert("Navigation data not found");
					// }
					// else {
						// var applist = $('#app-list');
						// for(var i = 0; i < apps.length; i++) {

							// var parentWrapper = $(document.createElement('li'));
							
							// if(apps[i]['name'] === 'Library'){									
								
								// apps[i].url += ('Default.aspx?key=' + data.LibEncrypted.EncryptResult);
							// }

							// // var parentContent = parentWrapper.append($(document.createElement('a')).attr('href', (apps[i]['url'] || '#')).text(apps[i]['name']));
							// var menu_name = apps[i]['name'];
							// var menu_icon_name = menu_name.toLowerCase().replace(' ', '-');
							// var parentContent = parentWrapper.append('<a href="'+(apps[i]['url'] || '#')+'"><i class="icon icon-nav-'+menu_icon_name+'"></i><span class="label">'+menu_name+'</span></a>');
							
							// if(apps[i].url !== undefined)
							// {
								// if(apps[i].url.indexOf('http://') == 0) {
									// parentContent.find('a').attr('target', '_blank');
								// }
							// }

							// if (apps[i]['sub'] && apps[i]['sub'].length > 0) {
								// var childUl = $(document.createElement('ul'));
								// for(var j = 0; j < apps[i]['sub'].length; j++) {

									// var url = apps[i]['sub'][j]['url'];

									// if(apps[i]['sub'][j]['name'] == 'Buddy Coordinator' && UserInfo.username.substring(0,1) != "B")
									// {
										// continue;
									// }
									// else if(apps[i]['sub'][j]['name'] == 'Buddy Coordinator')
									// {
										// url += ("?input=" + data.BCEncryptData.EncryptedString + "&token=" + data.BCEncryptData.token);
									// }

									
									
									// url = url.replace('{username}', UserInfo.username.trim());
									// url = url.replace('{name}', UserInfo.name.trim());

																			
									// var anchor = $(document.createElement('a')).text(apps[i]['sub'][j]['name']).attr('href', url);
									
									// if(url.indexOf('http://') == 0)
									// {
										// anchor.attr('target', '_blank');
									// }

									// if (apps[i]['sub'][j]['target']) {
										// anchor.attr('target', apps[i]['sub'][j]['target']);
									// }
									
									// var li = $(document.createElement('li'));

									// li.append(anchor);
									// childUl.addClass('sub-sub-menu').append(li);
								// }
								// parentWrapper.append(childUl);
							// }
							// else{
								// parentWrapper.css('background','none');
							// }
							
							// applist.append(parentWrapper);
						// }
					
						// // All menu item which has sub-menu should have .has-sub class. Make it automattic
						// $('#main-nav-expand li:has("ul")').addClass('has-sub');
					// }
				// });
			// },

			// error: function(err){

			// }
		// });
	// });
	
	// (function() {
		// var Period = '';
		// BM.buildPeriodMover('#CoursePeriodSelector', function(_period) {
		
			// Period = _period;			
			// $('.courselist').trigger('loadservice');
			
		// });

		
		// $(".courselist").serviceBind(function() {
			
			// return 'lecturer/currentcourse/gettaughtcourses/' + Period;
		// }, false, function(data) {
		
			// $('#CoursePeriodSelector').trigger('periodLoad', data.Period);
		// });

	// })();
	// $('.colleagues').serviceBind('lecturer/profile/getcolleagues');

	$('#logout').live('click', function(e) {
		e.preventDefault();
		$.ajax({
			type: 'POST',
			url: BM.serviceUri + 'usersession/logout',
			success: function(data){
				if(data.status != 'success') {
					return;
				}
				
				location.href = BM.loginUri;
			}
		});
		
	});
	
	/* Notification */

	$('#notiflink').click(function() {
		$('#notification-container').animate({height: 'toggle', opacity: 'toggle'}, 'fast');
		$('#mainnameext.visible').animate({height: 'hide', opacity: 'hide'}).removeClass('visible').parent().removeClass('selected');
		return false;
	});
	$('#notification-container .notification').click(function() {
		self.location = $('a', this)[0].href;
	});
	
	$('#notification-container').click(function(e) {
		e.stopPropagation();
	});
	
	$('#mainnameext').live('click', function(e) {
		e.stopPropagation();
	});

	$('#loggedUsername').live('click', function() {
		$('#mainnameext').animate({height: 'show', opacity: 'show'}, 'fast', function() {
			$(this).addClass('visible')
		});
		$(this).parent().toggleClass('selected');
	});
	
	$(document).click(function(e) {
		$('#notification-container:visible').animate({height: 'toggle', opacity: 'toggle'});
		$('#mainnameext.visible').animate({height: 'hide', opacity: 'hide'}).removeClass('visible').parent().removeClass('selected');
	});
	
	/* Chat */
	
	$('#chatlink').click(function() {
		$('#chat-container').animate({height: 'toggle', opacity: 'toggle'}, 'fast');
		return false;
	});
	
	$('#chat-container').click(function(e) {
		e.stopPropagation();
	});

	$(document).click(function(e) {
		$('#chat-container:visible').animate({height: 'toggle', opacity: 'toggle'});
	});

	/* Role Based App List Menu */

	$('#roleLabel').text(($.cookie('roleLabel') || 'Lecturer').toUpperCase());
	var role = $.cookie('role') || 'lecturer';
	
	$('#roleselector a').click(function() {
		$.cookie('role', $(this).data('targetRole'));
		$.cookie('roleLabel', $(this).text());
	});
	
	// TODO: Temporarily hard-coded
	if (role == 'lecturer') {
		$('.profilepic img').attr({src: 'images/profile.png'});
		$('.courselist').show();
		
		
	}
	else {
		$('.profilepic img').attr({src: 'images/Yanti.png'});
		$('.courselist').hide();
	}

	var defaultView = 'roles/' + role + '/index';
	// $(window).bind('hashchange', function() {
		// $(window).unbind('viewLoad'); // resets the onViewLoad event
		
		// $_GET = {};
		// viewsQueue = 0;
		// var hash = location.hash.substring(1) || defaultView;
		// var questionMarkPos;
		
		// $.fancybox.close();

		// // Close expanded #top-nav
		// $('#main-nav-expand').removeClass('hover').find('.sub-menu').css('display', '');
		// $('#profile-expand').removeClass('hover');

		// // #view?param1=value#popup?param2=value
		// var segments = hash.split('#', 2);
		// var view = segments[0];
		// var subview = segments[1];
		// var querystring;
		
		// questionMarkPos = view.indexOf('?');
		// if (questionMarkPos > -1) {
			// querystring = view.substring(questionMarkPos + 1);
			// $.extend($_GET, parseQueryString(querystring));
			// view = view.substring(0, questionMarkPos);
		// }
		
		// if (viewHistoryStack[0]) {
			// viewHistoryStack[0]['scrollTop'] = $(window).scrollTop();
		// }
		// viewHistoryStack.unshift({view: view, subview: subview, hash: hash, querystring: querystring, scrollTop: 0});
		// viewHistoryStack = viewHistoryStack.slice(0, 3);

		// //if (!viewHistoryStack[1] || viewHistoryStack[1]['querystring'] != querystring || viewHistoryStack[1]['view'] != view) {
		// if (!viewHistoryStack[1] || viewHistoryStack[1]['view'] != view || (!viewHistoryStack[1]['subview'] && viewHistoryStack[1]['querystring'] != querystring)) {
			// viewsQueue++;

			// $.get('views/' + view + '.html', function(responseText, textStatus, req) {
				// $('#themaincontent').html(responseText);
			// }).fail(function() {
				// $('#themaincontent').empty();
				// BM.globalErrorNotifier('Error loading main view');
			// }).always(function() {
				// $(window).trigger('viewQueueFinished');
			// });
			
			// viewsQueue++;
			// $.ajax('views/' + view + '.js', {cache: true, dataType: 'script'}).fail(function(jqXHR) {
				// if (jqXHR.status == 404) {
					// // the js file is not provided, ignore it
					// // TODO: all html files had to have their own JS file.
				// }
				// else {
					// BM.globalErrorNotifier('Error loading main view js file');
				// }
			// }).always(function() {
				// $(window).trigger('viewQueueFinished');
			// });
		// }

		// if (subview) {
			// viewsQueue++;
			// questionMarkPos = subview.indexOf('?');
			// if (questionMarkPos > -1) {
				// $.extend($_GET, parseQueryString(subview.substring(questionMarkPos + 1)));
				// subview = subview.substring(0, questionMarkPos);
			// }
			
			// function afterCloseCallback() {
				// //viewHistoryStack.shift();
				// if (viewHistoryStack[1]) {
					// history.go(-1);
				// }
				// else {
					// window.location.hash = '#' + view + (querystring ? '?' + querystring : '');
				// }
				// isHistoryBack = true;
			// }
			
			// $.get('views/' + view + '/' + subview + '.html', function(responseText, textStatus, req) {
				// $.fancybox({
					// content: responseText,
					// afterClose: afterCloseCallback
				// });

				// $.fancybox.toggle();
			// }).fail(function() {
				// BM.globalErrorNotifier('Error loading sub view');
			// }).always(function() {
				// $(window).trigger('viewQueueFinished');
			// });

			// viewsQueue++;
			// $.ajax('views/' + view + '/' + subview + '.js', {cache: true, dataType: 'script'}).fail(function(jqXHR) {
				// if (jqXHR.status == 404) {
					// // the js file is not provided, ignore it
					// // TODO: all html files had to have their own JS file.
				// }
				// else {
					// BM.globalErrorNotifier('Error loading sub view js file');
				// }
			// }).always(function() {
				// $(window).trigger('viewQueueFinished');
			// });
		// }
	// }).trigger('hashchange');
	
	$(window).scroll(function(e){
		if(window.scrollY > 95) {
			//$('#headnav').addClass('fixed');
		} else {
			$('#headnav').removeClass('fixed');
		}
	});
	
	
	$('#frmBugReport').submit(function(e) {
		e.preventDefault();
		
		var $this = $(this);
		var data = {
			Subject: this.subject.value,
			Description: this.body.value
		};
		
		if (data.Subject == '' || data.Description == '') {
			alert('Please fill all fields');
			return;
		}
		
		$.ajax({
			type: 'POST',
			url: BM.serviceUri + 'general/submitbugreport',
			data: JSON.stringify(data),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
		}).done(function(data) {
			if (data.status == 'success') {
				alert("Your feedback / bug report has been sent. We will soon respond your feedback.\r\n\r\nThank you - BM3 Team");
			}
			else {
				alert("Sorry, it seems there is a problem while saving your bug report. You may try again later or contact the admin directly.\r\n\r\nThank you - BM3 Team");
			}
			
			$this[0].reset();
		}).fail(function() {
		}).always(function() {
		});
		
		return false;
	});
});

$(window).bind('viewQueueFinished', function() {
	viewsQueue--;
	
	if (viewsQueue == 0) {
		$(window)
			.bind('viewLoad', BM.onViewLoad)
			.trigger('viewLoad');
			main_nav_height();
			body_nav_init();
	}
});

function parseQueryString(query) {
	var vars = query.split("&");
	var results = [];
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		results[pair[0]] = pair[1];
	}
	
	return results;
}

String.prototype.formatDate = function(format, sourceFormat) {
	var d = ("" + this).replace(/\.[0-9]+$/g, '');
	var tries = ['yyyy-MM-dd HH:mm:ss', 'yyyy-MM-dd'];

	if (sourceFormat) {
		tries.unshift(sourceFormat);
	}
	
    d = Date.parseExact(d, tries);
	
	return d ? d.toString(format) : 'N/A';
};
String.prototype.toSQLDate = function(format) {
	return Date.parse(this, format).toString('yyyy-MM-dd HH:mm:ss.000');
};
String.prototype.padRight = function(length, str) {
    return this + Array(length + 1 - this.length).join(str || ' ');
};

$.xhrPool = [];
$.xhrPool.abortAll = function() {
	$.each(this, function(index, jqXHR) {
		jqXHR.abort();
	});
};
$.ajaxSetup({
	beforeSend: function(jqXHR) {
		$.xhrPool.push(jqXHR);
	}
});
$.fn.mergeColumnsDown = function(cols) {
	$(this).each(function() {
		var table = this;
		cols = cols || [1];
		cols.sort();
		cols.reverse();

		$(cols).each(function(index) {
			var last_column = $('td.notexists', table);
			var rowspan = 0;
			function __callback() {
				var $this = $(this);
				if ($this.text() === last_column.text()) {
					rowspan++;
					$this.remove();
				}
				else {
					last_column.attr({rowspan: rowspan});
					last_column = $this;
					rowspan = 1;
				}
			}
			$('td:nth-child(' + this + ')', table).each(__callback);
			$('<td></td>').each(__callback);
		});
	});
};

$.loadservice = function(endpoint, afterload) {
	if (typeof endpoint == 'function') {
		endpoint = endpoint();
	}
	
	if (typeof endpoint == 'object') {
		afterload(endpoint);
		
		return false;
	}
	
	var jqXHR = $.getJSON(BM.serviceUri + endpoint, function(data) {
		afterload(data);
	}).fail(function(jqXHR) {
		if (jqXHR.status == 401) {
			location.href = BM.loginUri;
		}
		
		BM.logClientError('Error loading service ' + endpoint + ' with response ' + jqXHR.responseText);
		BM.globalErrorNotifier('Error while loading service endpoint');
	});
	
	return jqXHR;
}

$.fn.serviceBind = function(serviceEndpoint, transformFunc, onloadFunc) {
	var $this = $(this);
	var data = ko.observable({});	
	
	$this.bind('loadservice', function() {
		//var x = $this.offset().left, y = $this.offset().top, w = $this.width(), h = $this.height();
		//var loading_overlay = $("<div></div>").css({position: 'absolute', left: x, top: y, width: w - 20, height: h - 20, opacity: 0.5, backgroundColor: '#000', color: '#fff', padding: 10, fontSize: '16px'}).text('Loading...').appendTo($('body'));

		$.loadservice(serviceEndpoint, function(returnedData) {
			if (transformFunc) {
				data(transformFunc(returnedData));
			}
			else {
				data(returnedData);
			}
			
			if (!$this.data('boundData')) {
				$this.each(function() {
					ko.applyBindings(data, this);
				});

				$this.data('boundData', data);
			}

			if (onloadFunc) {
				onloadFunc(returnedData);
			}
			//loading_overlay.remove();
		});
	}).first().trigger('loadservice');
};

$.fn.bindService = function(serviceEndpoint, transformFunc, onloadFunc) {
	var $this = $(this);
	var data;
	
	$this.bind('loadservice', function() {
		//var x = $this.offset().left, y = $this.offset().top, w = $this.width(), h = $this.height();
		//var loading_overlay = $("<div></div>").css({position: 'absolute', left: x, top: y, width: w - 20, height: h - 20, opacity: 0.5, backgroundColor: '#000', color: '#fff', padding: 10, fontSize: '16px'}).text('Loading...').appendTo($('body'));

		$.loadservice(serviceEndpoint, function(returnedData) {
			if (transformFunc) {
				returnedData = transformFunc(returnedData);
			}
			
			if (!data) {
				data = ko.mapping.fromJS(returnedData);
			}
			
			if (!$this.data('boundData')) {
				$this.each(function() {
					ko.applyBindings(data, this);
				});

				$this.data('boundData', data);
			}

			if (onloadFunc) {
				onloadFunc(returnedData);
			}
			//loading_overlay.remove();
		});
	}).first().trigger('loadservice');
};

$.fn.serviceBindPost = function(method, serviceEndpoint, transformFunc, onloadFunc) {
	$(this).each(function() {
		var form = $(this);
		var onsubmitting = false;
		var callback = function() {
			var endpoint = BM.serviceUri + serviceEndpoint;
			var data = form.toJSON();
			
			form.find(':file').extractInputFiles(function(files) {
				data = $.extend(data, files);
				
				if (transformFunc) {
					data = transformFunc(data);
				}

				if (!data) {
					onsubmitting = false;
					return false;
				}
				
				$.ajax({
					type: method,
					url: endpoint,
					data: JSON.stringify(data),
					contentType: "application/json; charset=utf-8",
					dataType: "json",
				}).done(function(data) {
					if (onloadFunc) {
						onloadFunc(data);
					}
				}).fail(function(jqXHR) {
					BM.globalErrorNotifier();
					BM.logClientError('Error posting to service ' + endpoint + ' with data ' + JSON.stringify(data) +  + ' with response ' + jqXHR.responseText);
				}).always(function() {
					setTimeout(function() {
						onsubmitting = false;
					}, 1000);
				});
			});
		};
		
		$(this).submit(function(e) {
			e.preventDefault();
			
			if (!onsubmitting) {
				onsubmitting = true;
				callback();
			}
		});
	});
};

// How to use: $('form').extractInputFiles(function() { ... });

$.fn.extractInputFiles = function(callback) {
	var data = {};
	var files_queue = 0;
	var files = 0;

	$(this).each(function() {
		var _this = this;
		for (var i = 0, f; f = this.files[i]; i++) {
			var reader = new FileReader();
			files_queue++;
			files++;

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					// Render thumbnail
					
					var file = {
						Filename: theFile.name,
						Size: theFile.size,
						Content: e.target.result.replace(/^.*\,/g, '')
					};
					
					if (_this.multiple) {
						if (!data[_this.name]) {
							data[_this.name] = [];
						}
						
						data[_this.name].push(file);
					}
					else {
						data[_this.name] = file;
					}
					
					files_queue--;
					
					if (files_queue == 0) {
						callback(data);
					}
				};
			})(f);

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		}
	});
		
	if (files == 0) {
		callback(data);
	}
};

// https://github.com/macek/jquery-to-json
$.fn.toJSON = function(options){
	options = $.extend({}, options);

	var self = this,
		json = {},
		push_counters = {},
		patterns = {
			"validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
			"key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
			"push":     /^$/,
			"fixed":    /^\d+$/,
			"named":    /^[a-zA-Z0-9_]+$/
		};
		
	this.build = function(base, key, value){
		base[key] = value;
		return base;
	};

	this.push_counter = function(key){
		if(push_counters[key] === undefined){
			push_counters[key] = 0;
		}
		return push_counters[key]++;
	};

	$.each($(this).serializeArray(), function(){

		// skip invalid keys
		if(!patterns.validate.test(this.name)){
			return;
		}

		var k,
			keys = this.name.match(patterns.key),
			merge = this.value,
			reverse_key = this.name;

		while((k = keys.pop()) !== undefined){

			// adjust reverse_key
			reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

			// push
			if(k.match(patterns.push)){
				merge = self.build([], self.push_counter(reverse_key), merge);
			}

			// fixed
			else if(k.match(patterns.fixed)){
				merge = self.build([], k, merge);
			}

			// named
			else if(k.match(patterns.named)){
				merge = self.build({}, k, merge);
			}
		}

		json = $.extend(true, json, merge);
	});

	return json;
};

function populateGrid(selector, data, oddeven) {
	var $this = $(selector);
	var template = $this.children().first();
	var current = 'odd';
	
	for(var i = 0; i < data.length; i++) {
		var row = template.clone();
		for(var key in data[i]) {
			var col = row.find('.' + key);
			if (col.hasClass('unescaped')) {
				col.html(data[i][key]);
			}
			else {
				col.text(data[i][key]);
			}
		}
		
		if (oddeven) {
			row.addClass(current);
			current = (current == 'odd') ? 'even' : 'odd';
		}
		
		$this.append(row);
	}
	
	template.hide();
}